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
        backgroundColor: theme.colors.dkMode,
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
        flex: 1,
        flexDirection: 'column',
        gap: 16,
        paddingHorizontal: 20,
        marginTop: 16
      },
    
      menu: {
        flexDirection: 'row',
        gap: 8.5,
        height: 32
      },

      menuCard: {
        flex: 1,
        backgroundColor: theme.colors.bgButton,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
      },

      scrollview: {
        flex: 1,
      },
    
      map: {
        backgroundColor: "white",
        borderRadius: 8,
        height: 190,
      },
    
      cardsList: {
        marginTop: 16,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        marginBottom: 16
      },

      card: {
        backgroundColor: theme.colors.bgButton,
        borderRadius: 8,
        width: "47%",
        height: 103,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12
      },

      description: {
        textAlign: 'center',
        paddingHorizontal: 10,
        color: theme.colors.textThird
      },
      
      value: {
        fontSize: 40
      }
    }
)