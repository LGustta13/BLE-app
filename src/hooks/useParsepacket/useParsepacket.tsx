import { Buffer } from "buffer";
import { useState } from "react";
import {
    StyleSheet,
    Text,
} from "react-native";

import GalileoParsePacket from "./parse";
import Packet from "./packet";

// interface ParsePacketApi {
//     handleRecvPkg: (packet: Buffer) => void;
//     outParsedPkg: GalileoParsePacket;
// }

const HEADERLEN = 3;
const TAGHEADER = 0x01;
const MAGICHEADERLEN = 4;
const MILLISECONDSTOSECONDS = 1000;

function useParsepacket() {

    const [outParsedPkg, setOutParsedPkg] = useState<GalileoParsePacket>(new GalileoParsePacket())

    const handleRecvPkg = (packet: Buffer) => {

        const data = packet.subarray(MAGICHEADERLEN, packet.length);
        const headerBuf = data.subarray(0, HEADERLEN);

        if (headerBuf[0] !== TAGHEADER) {
            console.log("Pacote não está no formato Galileo");
            return;
        }

        const pkg = new Packet();
        try {
            pkg.decode(data);
        } catch (error) {
            console.log(error);
            return;
        }

        if (pkg.tags.length < 1) {
            console.log('Nenhum dado decodificado');
            return;
        }

        let outPkg = new GalileoParsePacket();
        const receivedTime = Math.floor(Date.now() / MILLISECONDSTOSECONDS);
        outPkg.receivedTimestamp = receivedTime;

        for (const curTag of pkg.tags) {
            switch (curTag.tag) {
                case 0x01:
                    outPkg.hardwareVersion = curTag.value.val;
                    break;
                case 0x02:
                    outPkg.firmwareVersion = curTag.value.val;
                    break;
                case 0x03:
                    outPkg.imei = curTag.value.val;
                    break;
                case 0x04:
                    outPkg.client = curTag.value.val;
                    break;
                case 0x10:
                    outPkg.packetID = curTag.value.val;
                    break;
                case 0x20:
                    outPkg.navigationTimestamp = Math.floor(curTag.value.val.getTime() / 1000);
                    break;
                case 0x30:
                    outPkg.nsat = curTag.value.nsat;
                    outPkg.latitude = curTag.value.latitude;
                    outPkg.longitude = curTag.value.longitude;
                    break;
                case 0x33:
                    outPkg.course = curTag.value.course;
                    outPkg.speed = curTag.value.speed;
                    break;
                case 0x34:
                    outPkg.height = curTag.value.val;
                    break;
                case 0x35:
                    outPkg.hdop = curTag.value.val;
                    break;
                case 0x40:
                    outPkg.deviceStatus = curTag.value.val;
                    break;
                case 0x41:
                    outPkg.supplyVoltage = curTag.value.val;
                    break;
                case 0x42:
                    outPkg.batteryVoltage = curTag.value.val;
                    break;
                case 0x43:
                    outPkg.temperature = curTag.value.val;
                    break;
                case 0x44:
                    outPkg.accelX = curTag.value.x;
                    outPkg.accelY = curTag.value.y;
                    outPkg.accelZ = curTag.value.z;
                    break;
                case 0x45:
                    outPkg.outputStatus = curTag.value.val;
                    break;
                case 0x46:
                    outPkg.inputStatus = curTag.value.val;
                    break;
                case 0x50:
                    outPkg.inputVoltage0 = curTag.value.val;
                    break;
                case 0x51:
                    outPkg.inputVoltage1 = curTag.value.val;
                    break;
                case 0x52:
                    outPkg.inputVoltage2 = curTag.value.val;
                    break;
                case 0x53:
                    outPkg.inputVoltage3 = curTag.value.val;
                    break;
                case 0x54:
                    outPkg.inputVoltage4 = curTag.value.val;
                    break;
                case 0x55:
                    outPkg.inputVoltage5 = curTag.value.val;
                    break;
                case 0x56:
                    outPkg.inputVoltage6 = curTag.value.val;
                    break;
                case 0x57:
                    outPkg.inputVoltage7 = curTag.value.val;
                    break;
                case 0x60:
                    outPkg.rs485a = curTag.value.val;
                    break;
                case 0x61:
                    outPkg.rs485b = curTag.value.val;
                    break;
                case 0x62:
                    outPkg.rs485c = curTag.value.val;
                    break;
            }
        }
        setOutParsedPkg(outPkg);
    };

    return (
        <>
            <Text>Galileosky BLE</Text>
            <Text style={styles.heartRateTitleText}>Dados do coletor</Text>
            {
                outParsedPkg.imei ? (<Text style={styles.heartRateTitleTextSnd}>{outParsedPkg.imei}</Text>) :
                    (<Text>...</Text>)
            }

            {/* <Text style={styles.heartRateText}>{galileoDataBuffer}</Text> */}
            {/*<Text style={styles.heartRateText}>TAMANHO: {size}</Text> */}
            <Text style={styles.heartRateText}>FIRMWARE: {outParsedPkg.firmwareVersion}</Text>
            {/* <Text style={styles.heartRateText}>: {outParsedPkg.hardwareVersion}</Text> */}
            {/* <Text style={styles.heartRateText}>RECEIVED: {outParsedPkg.receivedTimestamp}</Text>*/}
            {/*<Text style={styles.heartRateText}>NAVIGATION: {outParsedPkg.navigationTimestamp}</Text> */}
            <Text style={styles.heartRateText}>LATITUDE: {outParsedPkg.latitude}</Text>
            <Text style={styles.heartRateText}>LONGITUDE: {outParsedPkg.longitude}</Text>
            {/* <Text style={styles.heartRateText}>BATERIA: {outParsedPkg.batteryVoltage}</Text>*/}
            {/*<Text style={styles.heartRateText}>FONTE: {outParsedPkg.supplyVoltage}</Text>*/}
            {/*<Text style={styles.heartRateText}>ALTITUDE: {outParsedPkg.height}</Text>*/}
            {/*<Text style={styles.heartRateText}>HDOP: {outParsedPkg.hdop}</Text>*/}
            {/*<Text style={styles.heartRateText}>TEMPERATURA: {outParsedPkg.temperature}</Text>*/}
            <Text style={styles.heartRateText}>VELOCIDADE: {outParsedPkg.speed} Km/h</Text>
            {/*<Text style={styles.heartRateText}>PACOTE: {outParsedPkg.packetID}</Text> */}
            {/*<Text style={styles.heartRateText}>ENTRADA 3: {outParsedPkg.inputVoltage3}</Text> */}
        </>
    )
}

const styles = StyleSheet.create({
    heartRateTitleText: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginHorizontal: 20,
        color: "black",
    },
    heartRateTitleTextSnd: {
        fontSize: 20,
        marginTop: 5,
        textAlign: "center",
        marginHorizontal: 20,
        color: "black",
        backgroundColor: '#D3D3D3',
        padding: 10,
        borderRadius: 10,
    },
    heartRateText: {
        fontSize: 12,
        marginTop: 15,
        marginHorizontal: 10,
        display: 'flex',
    },
})

export default useParsepacket;