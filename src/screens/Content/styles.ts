import { StyleSheet } from "react-native";
import { theme } from "../../global/theme";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.bgPrimary,
        flex: 1
      },
    
      header: {
        backgroundColor: theme.colors.bgButton,
        height: 98,
        paddingHorizontal: 20,
        paddingTop: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
    
      buttons: {
        flexDirection: "row",
        gap: 8,
      },
    
      buttonDisconnect: {
        backgroundColor: theme.colors.disconnect,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 50,
        borderRadius: 30,
      },
    
      buttonDarkMode: {
        backgroundColor: theme.colors.textPrimary,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 50,
        marginBottom: 5,
        borderRadius: 30,
      },
    
      headerText: {
        flexDirection: "column",
        alignItems: "flex-end",
      },
    
      text: {
        fontSize: theme.text.text,
      },
    
      content: {
        flexDirection: 'column',
        gap: 16,
        paddingHorizontal: 20,
        marginTop: 16
      },
    
      menu: {
        backgroundColor: 'red',
        height: 32,
      },
    
      map: {
        backgroundColor: "yellow",
        height: 199,
      },
    
      cardsList: {
        flex: 1,
        backgroundColor: "purple",
      },

      card: {
        backgroundColor: "green",
        width: "45%",
      }
    }
)