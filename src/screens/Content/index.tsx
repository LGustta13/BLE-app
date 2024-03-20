import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { styles } from "./styles";
import Ionicons from '@expo/vector-icons/Ionicons';

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
      icon: "",
    },
    {
      id: 6,
      description: "freada brusca",
      icon: "",
    },
    {
      id: 7,
      description: "dentro faixa",
      icon: "",
    },
    {
      id: 8,
      description: "rolamento",
      icon: "",
    },
    {
      id: 9,
      description: "parado ligado",
      icon: "",
    },
    {
      id: 10,
      description: "posição pedal",
      icon: "",
    },
  ];

  const timers = [
    {
      id: 1,
      timer: "10 min",
    },
    {
      id: 2,
      timer: "30 min" 
    },
    {
      id: 3,
      timer: "1 hora",
    },
    {
      id: 4,
      timer: "8 horas",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.buttons}>
          <View style={styles.buttonDisconnect}></View>
          <View style={styles.buttonDarkMode}></View>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.text}>LUIS GUSTAVO DE SOUZA OLIVEIRA</Text>
          <Text style={styles.text}>PLACA</Text>
          <Text style={styles.text}>25/01/2024 12:00:00</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.menu}>
          {
            timers.map((timer) => {
              return (
                <View key={timer.id} style={styles.menuCard}>
                  <Text>{timer.timer}</Text>
                </View>
              )
            })
          }
        </View>

        <View style={styles.scrollview}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.map}>
              
            </View>

            <View style={styles.cardsList}>
              {etls.map((etl) => {
                return (
                  <View key={etl.id} style={styles.card}>
                    <View></View>
                    <Ionicons name={"speedometer-outline"} size={52} color="black" />
                    {/* <Text style={styles.value}>0</Text> */}
                    <Text style={styles.description}>{etl.description.toUpperCase()}</Text>
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
