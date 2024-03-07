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
          <CardDataText textDisplay="VELOCIDADE" value={data.can8bitr0} />
          <CardDataText textDisplay="PILOTO" value={data.can8bitr1} />
          <CardDataText textDisplay="POSICAO" value={data.can8bitr2} />
          <CardDataText textDisplay="RPM" value={data.can16bitr0} />
          <CardDataText textDisplay="SONDA 1" value={data.rs485a} />
          <CardDataText textDisplay="SONDA 2" value={data.rs485c} />
          <CardDataText textDisplay="DATA" value={data.navigationTimestamp} />
          <CardDataText textDisplay="LATITUDE" value={data.latitude} />
          <CardDataText textDisplay="LONGITUDE" value={data.longitude} />
          <CardDataText textDisplay="PARTIDA" value={data.inputVoltage3} />
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
