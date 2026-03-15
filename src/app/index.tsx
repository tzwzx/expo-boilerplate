import Constants from "expo-constants";
import { StyleSheet, Text, View, useColorScheme } from "react-native";

export default function HomeScreen() {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}>
        {Constants.expoConfig?.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
