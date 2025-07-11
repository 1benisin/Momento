import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function SocialProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Profile</Text>
      <View style={styles.separator} />
      <Text>This is where the user's social profile will be displayed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: "#eee",
  },
});
