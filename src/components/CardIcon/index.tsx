import { View, Text, Dimensions } from "react-native";
import { styles } from "./styles";
// import { Canvas, Path, Skia } from "@shopify/react-native-skia";

type IndicatorProps = {
  value: number;
  color: string;
};

type CardIconProps = {texto: string} & IndicatorProps

function CardIcon(props : CardIconProps) {
  const {texto, value, color} = props

  return (
    <View style={styles.cardIcon}>
      <Text>{texto}</Text>
      <Text>{value}</Text>
    </View>
  );
}

export default CardIcon;
