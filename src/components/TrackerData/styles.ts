import { StyleSheet } from "react-native"
import { theme } from "../../global/theme"

export const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },

  cardMapContainer: {
    height: "30%",
    width: "100%",
    borderRadius: 10,
    backgroundColor: theme.colors.bgButton,
    marginTop: 16,
  },

  cardDataContainer: {
    flexDirection: "row",
    gap: 16,
    height: "50%",
    width: "100%",
    marginTop: 16,
  },

  cardData: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.bgButton,
    height: "100%",
    width: "47.5%",
    borderRadius: 10,
    paddingVertical: 8
  },

  cardIconContainer: {
    flexDirection: "column",
    gap: 16,
    height: "100%",
    width: "47.5%",
    borderRadius: 10,
  },
})