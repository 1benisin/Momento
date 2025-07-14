import { useRouter, Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text } from "@/components/Themed";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function HostProfileSetupScreen() {
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [hostBio, setHostBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createHostProfile = useMutation(api.user.createHostProfile);

  const handleContinue = async () => {
    if (isLoading || !hostName || !hostBio) return;

    setIsLoading(true);
    try {
      await createHostProfile({
        hostProfile: {
          host_name: hostName,
          host_bio: hostBio,
        },
      });
      router.push("./verification-prompt");
    } catch (error) {
      console.error("Failed to create host profile:", error);
      Alert.alert("Error", "Could not create host profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Host Profile" }} />
      <Text style={styles.title}>Create Your Host Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Host Name"
        value={hostName}
        onChangeText={setHostName}
        placeholderTextColor="#999"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Host Bio"
        value={hostBio}
        onChangeText={setHostBio}
        multiline
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={[
          styles.button,
          (!hostName || !hostBio) && styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={isLoading || !hostName || !hostBio}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a0cfff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
