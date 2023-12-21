import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
    BleError,
    BleManager,
    Characteristic,
    Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const HEART_RATE_UUID = "0000180d-0000-1000-8000-00805f9b34fb"; // SERVICE UUID
const HEART_RATE_CHARACTERISTIC = "00002a37-0000-1000-8000-00805f9b34fb"; // NOTIFY

const GALILEOSKY_READ_UUID = "0783b03e8535b5a07140a304d2495cb7"; //SPS
const GALILEOSKY_NOTIFY_UUID = "0783b03e8535b5a07140a304d2495cb8"; //SERVER_TX, 250B, Cliente deve assinar SERVER_TX para receber mensagens
const GALILEOSKY_WRITENORESPONSE_UUID = "0783b03e8535b5a07140a304d2495cba"; //SERVER_RX, 250B, Cliente deve assinar SERVER_RX para enviar mensagens
const GALILEOSKY_WRITENORESPONSE_NOTIFY_UUID = "0783b03e8535b5a07140a304d2495cb9"; //FLOW_CTRL, 1B, não é usado

const NOTIFY_UUID = GALILEOSKY_NOTIFY_UUID;
const READ_UUID = GALILEOSKY_READ_UUID;
const WRITE_UUID = GALILEOSKY_WRITENORESPONSE_UUID;

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
*/

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    connectToDevice: (deviceId: Device) => Promise<void>;
    disconnectFromDevice: () => void;
    connectedDevice: Device | null;
    allDevices: Device[];
    galileo: number;
}

function useBLE(): BluetoothLowEnergyApi {

    const bleManager = useMemo(() => new BleManager(), []);
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [galileo, setGalileo] = useState<number>(0);

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
                console.log(device.localName)  
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
            setGalileo(0);
        }
    };

    const onHeartRateUpdate = (
        error: BleError | null,
        characteristic: Characteristic | null
    ) => {
        if (error) {
            console.log(error);
            return -1;
        } else if (!characteristic?.value) {
            console.log("No Data was received");
            return -1;
        }

        const rawData = base64.decode(characteristic.value);
        let innerHeartRate: number = -1;

        const firstBitValue: number = Number(rawData) & 0x01;

        if (firstBitValue === 0) {
            innerHeartRate = rawData[1].charCodeAt(0);
        } else {
            innerHeartRate =
                Number(rawData[1].charCodeAt(0) << 8) +
                Number(rawData[2].charCodeAt(2));
        }

        setGalileo(innerHeartRate);
    };

    const startStreamingData = async (device: Device) => {
        if (device) {
            device.monitorCharacteristicForService(
                READ_UUID,
                NOTIFY_UUID,
                onHeartRateUpdate
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
        galileo,
    };
}

export default useBLE;