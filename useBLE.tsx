import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
    BleError,
    BleManager,
    Characteristic,
    Device,
} from "react-native-ble-plx";

import { Buffer } from "buffer";
import base64 from "react-native-base64";

import * as ExpoDevice from "expo-device";

const GALILEOSKY_UUID = "0000a441-0000-1000-8000-00805f9b34fb" //SERVICE UUID
const GALILEOSKY_READ_UUID = "0783b03e-8535-b5a0-7140-a304d2495cb7"; //SPS
const GALILEOSKY_NOTIFY_UUID = "0783b03e-8535-b5a0-7140-a304d2495cb8"; //SERVER_TX, 250B, Cliente deve assinar SERVER_TX para receber mensagens
const GALILEOSKY_WRITENORESPONSE_UUID = "0783b03e-8535-b5a0-7140-a304d2495cba"; //SERVER_RX, 250B, Cliente deve assinar SERVER_RX para enviar mensagens
const GALILEOSKY_WRITENORESPONSE_NOTIFY_UUID = "0783b03e-8535-b5a0-7140-a304d2495cb9"; //FLOW_CTRL, 1B, não é usado

/****** Formato da mensagem / 250 bytes *******
| Byte nº | Length | Value |    Descrição     |
-----------------------------------------------
|   1     |    1   | 0x41  |                  |
|   2     |    1   | 0xA4  | Cabeçalho da     |
|   3     |    1   | 0x12  | Mensagem         |
|   4     |    1   | 0x21  |                  |
|  ...    |   ...  |       | Pacote principal |
|   n     |   15   | 0x03  |    IMEI          |
|  ...    |   ...  |       | Pacote principal |
-----------------------------------------------

Cabeçalho retornando: QaQSIQ== ()
https://cryptii.com/pipes/base64-to-binary

QaQSIQ==
AR4AAzg2MjM=
MTEwNjEzMTU=
MjQ2EAAAQEI=
K0GYXkKADkMmIMA=

Pacote: 
Header BLE:         41 A4 12 21 
Header PCT:         01 
Length:             1e 00 
IMEI:               03 38 36 32 33 31 31 30 36 31 33 31 35 32 34 36 
Number of record:   10 00 00 
Status device:      40 42 2B 
Supply Voltage:     41 98 5e 
Battery Voltage:    42 80 0e 
Inside temperature: 43 26
CRC:                20 c0

418d5e42780ec25f41a41221011c000338363233
1b419b5e42780e8b9c

41a41221
011e00
03 38 36 32 33 31 31 30 36 31 
33 31 35 32 34 36 10 00 00 40 
40 2b 41 a8 5e 42 79 0e 43 27
4055
*/

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    connectToDevice: (deviceId: Device) => Promise<void>;
    disconnectFromDevice: () => void;
    connectedDevice: Device | null;
    allDevices: Device[];
    galileoDataBuffer: Buffer;
    size: number;
}

const magic_header = 1101271585;
const magicHeaderLen = 4;

function useBLE(): BluetoothLowEnergyApi {

    const bleManager = useMemo(() => new BleManager(), []);
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [galileoDataBuffer, setGalileoDataBuffer] = useState<Buffer>(Buffer.alloc(0));
    const [size, setSize] = useState<number>(0);
    
    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Bluetooth Scan Permission",
                message: "Bluetooth Low Energy requires scan permission",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Bluetooth Connection Permission",
                message: "Bluetooth Low Energy requires connect permission",
                buttonPositive: "OK",
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );

        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
        );
    };

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "Bluetooth Low Energy requires Location",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionsGranted =
                    await requestAndroid31Permissions();

                return isAndroid31PermissionsGranted;
            }
        } else {
            return true;
        }
    };

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () =>
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }
            if (device && device.id?.includes("80:EA:CA:00:1E:43")) {
                // if (device) {
                console.log(device)
                setAllDevices((prevState: Device[]) => {
                    if (!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            startStreamingData(deviceConnection);
        } catch (e) {
            console.log("FAILED TO CONNECT", e);
        }
    };

    const disconnectFromDevice = () => {
        if (connectedDevice) {
            bleManager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
            setGalileoDataBuffer(Buffer.alloc(0));
            setSize(0);
        }
    };

    const decodeBase64 = (base64_string: string) => {
        const binaryData = base64.decode(base64_string);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
        }

        // Converter ArrayBuffer para Buffer hexadecimal
        const hexBuffer = Buffer.from(uint8Array);

        return hexBuffer;
    }



    const onGalileoUpdate = (
        error: BleError | null,
        characteristic: Characteristic | null
    ) => {

        if (error) {
            console.log(error);
            return -1;
        } else if (!characteristic?.value) {
            console.log("Nenhum dado recebido");
            return -1;
        }

        const rawData = decodeBase64(characteristic?.value ?? '');

        if (rawData.length >= magicHeaderLen) {
            if (rawData.readUInt32BE(0) === magic_header) {
                setGalileoDataBuffer(Buffer.alloc(0));
                setSize(0);
            }
        }

        setGalileoDataBuffer((prevState) => Buffer.concat([prevState, rawData]));
        setSize((prevState) => prevState + rawData.length)
    };

    // const onGalileoUpdate = (
    //     error: BleError | null,
    //     characteristic: Characteristic | null
    // ) => {
    //     if (error) {
    //         console.log(error);
    //         return -1;
    //     } else if (!characteristic?.value) {
    //         console.log("No Data was received");
    //         return -1;
    //     }

    //     const rawData = decodeBase64(characteristic?.value ?? '');

    //     if (onMagicHeader) {
    //         if (!header) {
    //             const headerBuf = rawData.slice(0, mainHeaderLen);
    //             const tag = headerBuf[0];
    //             setActualSize(rawData.length - mainHeaderLen)

    //             if (tag !== 0x01) {
    //                 console.log("Pacote não está no formato Galileo");
    //                 return;
    //             }

    //             const pkgLen = headerBuf.readUInt16LE(1);
    //             setGalileoData((prevState) => [...prevState, rawData]);
    //             setSize(pkgLen)
    //             setHeader(true)
    //         } else {

    //             setActualSize(actualSize + rawData.length)
    //             setGalileoData((prevState) => [...prevState, rawData])

    //             if (actualSize === size + crcLen) {

    //                 // decodificar aqui
    //                 setGalileoDataBuffer(galileoData)
    //                 setActualSize(0)
    //                 setSize(0)
    //                 setHeader(false)
    //                 setGalileoData([])
    //                 setOnMagicHeader(false)
    //             }
    //             return;
    //         }

    //     } else {

    //         if (rawData.length < magicHeaderLen) {
    //             console.log("Tamanho do magic header incompatível")
    //             return;
    //         }

    //         if (!ignoreFirstPkg) {
    //             console.log("Primeiro pacote não contado")
    //             setIgnoreFirstPkg(true);
    //             return;
    //         }

    //         const magicHeaderBuffer = rawData.slice(0, magicHeaderLen);

    //         if (magicHeaderBuffer.readUInt32BE() === magic_header) {
    //             setOnMagicHeader(true);
    //             setGalileoData((prevState) => [...prevState, magicHeaderBuffer]);
    //             return;
    //         }
    //     }
    // };

    const startStreamingData = async (device: Device) => {
        if (device) {
            device.monitorCharacteristicForService(
                GALILEOSKY_READ_UUID,
                GALILEOSKY_NOTIFY_UUID,
                onGalileoUpdate
            );
        } else {
            console.log("No Device Connected");
        }
    };

    return {
        scanForPeripherals,
        requestPermissions,
        connectToDevice,
        allDevices,
        connectedDevice,
        disconnectFromDevice,
        galileoDataBuffer,
        size,
    };
}

export default useBLE;