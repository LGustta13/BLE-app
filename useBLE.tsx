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

const GALILEOSKY_READ_UUID = "0783b03e-8535-b5a0-7140-a304d2495cb7";
const GALILEOSKY_NOTIFY_UUID = "0783b03e-8535-b5a0-7140-a304d2495cb8";
const NAME_GALILEO = "GS7X 86"

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

const magic_header = 1101271585; // 0x41 0xA4 0x12 0x21
const magic_header_len = 4;
const android_api_31 = 31; // Versão 12

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
            if ((ExpoDevice.platformApiLevel ?? -1) < android_api_31) {
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

    const searchDeviceRSSI = async (device: Device) => {
        return await device.readRSSI();
    }

    const scanForPeripherals = () =>
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }
            if (device && device.name?.includes(NAME_GALILEO)) {
                console.log(device.rssi);
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

        if (rawData.length >= magic_header_len) {
            if (rawData.readUInt32BE(0) === magic_header) {
                setGalileoDataBuffer(Buffer.alloc(0));
                setSize(0);
            }
        }

        setGalileoDataBuffer((prevState) => Buffer.concat([prevState, rawData]));
        setSize((prevState) => prevState + rawData.length)
    };

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