import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { styles } from "./styles";

function Content() {
  const etls = [
    {
      id: 1,
      description: "velocidade",
      icon: "",
    },
    {
      id: 2,
      description: "rpm",
      icon: "",
    },
    {
      id: 3,
      description: "tanque 1",
      icon: "",
    },
    {
      id: 4,
      description: "tanque 2",
      icon: "",
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
          <Text>D</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.map}></View>

          <View style={styles.cardsList}>
            {etls.map((etl) => {
              return (
                <View key={etl.id} style={styles.card}>
                  <Text>dfadsd</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Content;
