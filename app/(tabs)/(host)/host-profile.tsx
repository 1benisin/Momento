import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

const HostProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host Profile</Text>
      <Text>This screen will display the host's profile.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default HostProfileScreen;
