import { Text, View } from "react-native"
import { styles } from "./styles"

type CardDataTextProps = {
    textDisplay: string,
    value: number | string
}

export function CardDataText(props: CardDataTextProps) {
    const {textDisplay, value} = props

    return (
        <View style={styles.textContainer}>
            <Text style={styles.text}>{textDisplay}</Text>
            <Text style={styles.text}>{value}</Text>
        </View>
    )
}