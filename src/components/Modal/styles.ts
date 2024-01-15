import { StyleSheet } from "react-native";
import { theme } from "../../global/theme";

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        
    },
    modalFlatlistContainer: {
        flex: 1,
        justifyContent: "center",
    },
    modalCellOutline: {
        borderWidth: 1,
        borderColor: "black",
        alignItems: "center",
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
    },
    modalBg: {
        flex: 1,
        backgroundColor: theme.colors.bgPrimary,
    },
    modalTitleText: {
        marginTop: 40,
        fontSize: 30,
        fontWeight: "bold",
        marginHorizontal: 20,
        textAlign: "center",
    },
    ctaButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.connect,
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        paddingHorizontal: 12,
        marginHorizontal: 20,
        marginBottom: 5,
        borderRadius: 8,
    },
    ctaButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.textSecondary,
    },
});