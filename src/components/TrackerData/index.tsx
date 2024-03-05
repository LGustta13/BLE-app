import { View } from "react-native";
import { styles } from "./styles";

import { CardDataText } from "../CardDataText";
import CardIcon from "../CardIcon";
import GalileoParsePacket from "../../hooks/ParsePacket/parse";
import { useETL } from "../../hooks/useETL";

type TrackerDataProps = {
  data: GalileoParsePacket;
};

type IndicatorProps = {
  value: number;
  color: string;
};

type ETLProps = {
  dentroFaixa: IndicatorProps;
  rolamento: IndicatorProps;
  paradoLigado: IndicatorProps;
  faixaPedal: IndicatorProps;
  createdAt: IndicatorProps;
};

export function TrackerData({ data }: TrackerDataProps) {
  const { etl } = useETL();

  return (
    <>
      <View style={styles.cardMapContainer}></View>

      <View style={styles.cardDataContainer}>
        <View style={styles.cardData}>
          {data.imei ? (
            <CardDataText textDisplay="" value={data.imei} />
          ) : (
            <CardDataText textDisplay="" value={"..."} />
          )}

          <CardDataText textDisplay="FIRMWARE" value={data.firmwareVersion} />
          <CardDataText textDisplay="HARDWARE" value={data.hardwareVersion} />
          <CardDataText textDisplay="CLIENTE" value={data.client} />
          <CardDataText textDisplay="PACOTE" value={data.packetID} />
          <CardDataText textDisplay="BATERIA" value={data.batteryVoltage} />
          <CardDataText textDisplay="FONTE" value={data.supplyVoltage} />
          <CardDataText textDisplay="TEMPERATURA" value={data.temperature} />
          <CardDataText textDisplay="IGNIÇÃO" value={0} />
          <CardDataText textDisplay="ODÔMETRO" value={0} />
          <CardDataText textDisplay="RPM" value={0} />
          <CardDataText textDisplay="CONSUMO CAN" value={0} />
        </View>

        <View style={styles.cardIconContainer}>
          <CardIcon texto="Dentro da Faixa" value={etl.dentroFaixa.value} color={etl.dentroFaixa.color}/>
          <CardIcon texto="Faixa Econômica Pedal" value={etl.faixaPedal.value} color={etl.faixaPedal.color}/>
          <CardIcon texto="Parado Ligado" value={etl.paradoLigado.value} color={etl.paradoLigado.color}/>
          <CardIcon texto="Rolamento" value={etl.rolamento.value} color={etl.rolamento.color}/>
        </View>
      </View>
    </>
  );
}
