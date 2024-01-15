import { Text, View } from "react-native"
import { styles } from "./styles"

import GalileoParsePacket from "../../hooks/useParsepacket/parse"
import { CardDataText } from "../CardDataText"

type TrackerDataProps = {
    data: GalileoParsePacket
}

export function TrackerData({ data }: TrackerDataProps) {

    return (
        <>

            <View style={styles.cardMapContainer}>

            </View>

            <View style={styles.cardDataContainer}>

                <View style={styles.cardData}>

                    {
                        data.imei ? (
                        <CardDataText textDisplay="" value={data.imei}/>) : (
                        <CardDataText textDisplay="" value={"..."}/>)
                    }
                    
                    <CardDataText textDisplay="FIRMWARE" value={data.firmwareVersion}/>
                    <CardDataText textDisplay="HARDWARE" value={data.hardwareVersion}/>
                    <CardDataText textDisplay="CLIENTE" value={data.client}/>
                    <CardDataText textDisplay="PACOTE" value={data.packetID}/>
                    <CardDataText textDisplay="BATERIA" value={data.batteryVoltage}/>
                    <CardDataText textDisplay="FONTE" value={data.supplyVoltage}/>
                    <CardDataText textDisplay="TEMPERATURA" value={data.temperature}/>
                    <CardDataText textDisplay="IGNIÇÃO" value={0}/>
                    <CardDataText textDisplay="ODÔMETRO" value={0}/>
                    <CardDataText textDisplay="RPM" value={0}/>
                    <CardDataText textDisplay="CONSUMO CAN" value={0}/>

                </View>

                <View style={styles.cardIconContainer}>
                    <View style={styles.cardIcon}>

                    </View>

                    <View style={styles.cardIcon}>

                    </View>

                    <View style={styles.cardIcon}>

                    </View>

                </View>
            </View>
        </>
    )
}