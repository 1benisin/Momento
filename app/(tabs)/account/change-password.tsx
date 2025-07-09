import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function ChangePasswordScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const onChangePassword = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
      });
      Alert.alert("Success", "Your password has been changed.");
      router.back();
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert(
        "Error",
        "Could not change your password. Please ensure your current password is correct."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        title={isSaving ? "Saving..." : "Save New Password"}
        onPress={onChangePassword}
        disabled={isSaving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 20,
  },
});
