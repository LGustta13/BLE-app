import { StyleSheet } from "react-native";
import { theme } from "../../global/theme";

export const styles = StyleSheet.create({
    ctaButtonConnect: {
        backgroundColor: theme.colors.connect,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        marginBottom: 5,
        borderRadius: 8,
      },
      ctaButtonDisconnect: {
        backgroundColor: theme.colors.disconnect,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 5,
        left: 5,
        height: 50,
        width: 50,
        marginBottom: 5,
        borderRadius: 30,
      },
      ctaButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
      },
});