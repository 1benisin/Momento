import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

const HostInboxScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host Inbox</Text>
      <Text>This screen will display messages for the host.</Text>
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

export default HostInboxScreen;
