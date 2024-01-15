import { TouchableOpacity, Text } from "react-native";
import { Device } from "react-native-ble-plx";

import { styles } from "./styles";

type ButtonConnectProps = {
    textConnect: string,
    textDisconnect: string,
    connectedDevice: Device | null,
    disconnectFromDevice: () => void,
    openModal: () => void,
}

export function ButtonConnect(props: ButtonConnectProps) {
    const { textConnect, textDisconnect, connectedDevice, disconnectFromDevice, openModal } = props

    return (
        <TouchableOpacity
            onPress={connectedDevice ? disconnectFromDevice : openModal}
            style={connectedDevice ? styles.ctaButtonDisconnect : styles.ctaButtonConnect}
        >
            <Text style={styles.ctaButtonText}>
                {connectedDevice ? textDisconnect : textConnect}
            </Text>
        </TouchableOpacity>
    )
}