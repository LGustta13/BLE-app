import { StyleSheet } from "react-native";
import { theme } from "../../global/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  
  buttonsContainer: {
    gap: 16,
  },
  deleteButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleWrapper: {
    flex: 1,
  },
  
});