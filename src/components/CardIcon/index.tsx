import { View, Dimensions } from "react-native";
import { styles } from "./styles";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";

const { width, height } = Dimensions.get('window');

function CardIcon() {

    return (
        <View style={styles.cardIcon}>

        </View>
    )
}

export default CardIcon;