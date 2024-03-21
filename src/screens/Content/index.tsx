import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-root-toast";

import { Canvas, Circle } from "@shopify/react-native-skia";

function Content() {
  const etls = [
    {
      id: 1,
      description: "velocidade",
      icon: "speedometer-outline",
    },
    {
      id: 2,
      description: "rpm",
      icon: "timer-outline",
    },
    {
      id: 3,
      description: "tanque 1",
      icon: "clipboard-outline",
    },
    {
      id: 4,
      description: "tanque 2",
      icon: "clipboard-outline",
    },
    {
      id: 5,
      description: "aceleração brusca",
      icon: "chevron-up-circle-outline",
    },
    {
      id: 6,
      description: "freada brusca",
      icon: "chevron-down-circle-outline",
    },
    {
      id: 7,
      description: "dentro faixa",
      icon: "stats-chart-outline",
    },
    {
      id: 8,
      description: "rolamento",
      icon: "stats-chart-outline",
    },
    {
      id: 9,
      description: "parado ligado",
      icon: "stats-chart-outline",
    },
    {
      id: 10,
      description: "posição pedal",
      icon: "stats-chart-outline",
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
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.text}>25/01/2024 12:00:00</Text>
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
            <View style={styles.map}></View>

            <View style={styles.cardsList}>
              {etls.map((etl) => {
                return (
                  <View key={etl.id} style={styles.card}>
                    <Ionicons name={etl.icon} size={52} color="#5D5D5D" />
                    {/* <Text style={styles.value}>0</Text> */}
                    <Text style={styles.description}>
                      {etl.description.toUpperCase()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Content;
