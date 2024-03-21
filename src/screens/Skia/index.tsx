import { Canvas, Circle } from "@shopify/react-native-skia";
import { View } from "react-native";

// O que ele faz aqui?
// cx e cy são os pontos centrais do círculo em relação aos eixos horizontais e verticais da tela do celular
// cx 0 e cy 0 significa que o centro do circulo se localiza no primeiro pixel superior esquerdo da tela
// r é o raio da circunferência

function Skia() {
  return (
    <View style={{flex: 1, height: 500, backgroundColor: 'yellow', justifyContent: "center"}}>
      <View style={{ height: 200, backgroundColor: "green", margin: 20 }}>
        <Canvas style={{ flex: 1 }}>
          <Circle cx={52} cy={52} r={10} color={"red"} />
        </Canvas>
      </View>
    </View>
  );
}

export default Skia;
