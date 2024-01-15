import { Text } from "react-native"
import { styles } from "./styles"

type titleProps = {
    text: string,
}

export function TitleText({text} : titleProps) {
    
    return (
        <Text style={styles.titleText}>{text}</Text>
    )
}