import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { api } from "../../convex/_generated/api";

export default function ProfileSetupScreen() {
  const [firstName, setFirstName] = useState("");
  const [bio, setBio] = useState("");
  const createSocialProfile = useMutation(api.user.createSocialProfile);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (firstName.trim().length === 0) {
      // Basic validation
      alert("Please enter your first name.");
      return;
    }
    setIsLoading(true);
    try {
      await createSocialProfile({ firstName, bio });
      router.push("/initial-photo");
    } catch (error) {
      console.error("Failed to create social profile:", error);
      alert("Failed to save your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Tell us about yourself</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name (required)"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="A short bio (optional)"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={isLoading}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 20,
  },
});
