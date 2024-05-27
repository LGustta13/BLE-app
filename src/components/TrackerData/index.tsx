import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";

import { CardDataText } from "../CardDataText";
import CardIcon from "../CardIcon";
import GalileoParsePacket from "../../hooks/ParsePacket/parse";
import { useETL } from "../../hooks/useETL";

// Utilities
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-root-toast";

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

  let indicators = [
    {
      id: 1,
      description: "velocidade",
      icon: "speedometer-outline",
      value: data.can8bitr0
    },
    {
      id: 2,
      description: "rpm",
      icon: "timer-outline",
      value: data.can16bitr0
    },
    {
      id: 3,
      description: "tanque 1",
      icon: "clipboard-outline",
      value: data.supplyVoltage
    },
    {
      id: 4,
      description: "tanque 2",
      icon: "clipboard-outline",
      value: data.rs485c
    },
    {
      id: 5,
      description: "aceleração brusca",
      icon: "chevron-up-circle-outline",
      value: 2
    },
    {
      id: 6,
      description: "freada brusca",
      icon: "chevron-down-circle-outline",
      value: 1
    },
    {
      id: 7,
      description: "dentro faixa",
      icon: "stats-chart-outline",
      value: etl.dentroFaixa.value
    },
    {
      id: 8,
      description: "rolamento",
      icon: "stats-chart-outline",
      value: etl.rolamento.value
    },
    {
      id: 9,
      description: "parado ligado",
      icon: "stats-chart-outline",
      value: etl.paradoLigado.value
    },
    {
      id: 10,
      description: "posição pedal",
      icon: "stats-chart-outline",
      value: etl.faixaPedal.value
    },
  ];

  const timers = [
    {
      id: 1,
      timer: "10 min",
    },
    {
      id: 2,
      timer: "30 min",
    },
    {
      id: 3,
      timer: "1 hora",
    },
    {
      id: 4,
      timer: "8 horas",
    },
  ];

  function handleTimerButtonPress(timer: string) {
    Toast.show(`Configurado para ${timer}`, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: "white",
      textColor: "black",
    });
  }

  function handleDisconnectButton() {
    Toast.show("Desconectado", {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: "white",
      textColor: "black",
    });
  }

  function handleDarkMode() {
    Toast.show("Modo ativado", {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: "white",
      textColor: "black",
    });
  }

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.buttonDisconnect}
            activeOpacity={0.6}
            onPress={handleDisconnectButton}
          >
            <Ionicons name={"close-outline"} size={48} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonDarkMode}
            activeOpacity={0.6}
            onPress={handleDarkMode}
          >
            <Ionicons name={"moon-outline"} size={32} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.text}>LUIS GUSTAVO DE SOUZA OLIVEIRA</Text>
          <Text style={styles.text}>PLACA</Text>
          <Text style={styles.text}>{new Date(data.navigationTimestamp * 1000).toLocaleString("pt-BR")}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.menu}>
          {timers.map((timer) => {
            return (
              <TouchableOpacity
                key={timer.id}
                style={styles.menuCard}
                onPress={() => handleTimerButtonPress(timer.timer)}
              >
                <Text>{timer.timer}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.scrollview}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.map}>
              <Text>{data.latitude}</Text>
              <Text>{data.longitude}</Text>
            </View>

            <View style={styles.cardsList}>
              {indicators.map((indicator) => {
                return (
                  <View key={indicator.id} style={styles.card}>
                    <Ionicons name={indicator.icon} size={52} color="#5D5D5D" />
                    {/* <Text style={styles.value}>0</Text> */}
                    <Text style={styles.description}>
                      {indicator.description.toUpperCase()}
                    </Text>
                    <Text style={styles.description}>
                      {indicator.value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </>

    // <>
    //   <View style={styles.cardMapContainer}></View>

    //   <View style={styles.cardDataContainer}>
    //     <View style={styles.cardData}>
    //       {data.imei ? (
    //         <CardDataText textDisplay="" value={data.imei} />
    //       ) : (
    //         <CardDataText textDisplay="" value={"..."} />
    //       )}
    //       <CardDataText textDisplay="VELOCIDADE" value={data.can8bitr0} />
    //       <CardDataText textDisplay="PILOTO" value={data.can8bitr1} />
    //       <CardDataText textDisplay="POSICAO" value={data.can8bitr2} />
    //       <CardDataText textDisplay="RPM" value={data.can16bitr0} />
    //       <CardDataText textDisplay="SONDA 1" value={data.rs485a} />
    //       <CardDataText textDisplay="SONDA 2" value={data.rs485c} />
    //       <CardDataText textDisplay="DATA" value={data.navigationTimestamp} />
    //       <CardDataText textDisplay="LATITUDE" value={data.latitude} />
    //       <CardDataText textDisplay="LONGITUDE" value={data.longitude} />
    //       <CardDataText textDisplay="PARTIDA" value={data.inputVoltage3} />
    //     </View>

    //     <View style={styles.cardIconContainer}>
    //       <CardIcon texto="Dentro da Faixa" value={etl.dentroFaixa.value} color={etl.dentroFaixa.color}/>
    //       <CardIcon texto="Faixa Econômica Pedal" value={etl.faixaPedal.value} color={etl.faixaPedal.color}/>
    //       <CardIcon texto="Parado Ligado" value={etl.paradoLigado.value} color={etl.paradoLigado.color}/>
    //       <CardIcon texto="Rolamento" value={etl.rolamento.value} color={etl.rolamento.color}/>
    //     </View>
    //   </View>
    // </>
  );
}
