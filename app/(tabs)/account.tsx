import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SignOutButton } from "@/components/SignOutButton";

const AccountScreen = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [user]);

  const onSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await user.update({
        firstName: firstName,
        lastName: lastName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Could not save your changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
    // Reset fields to original values
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  };

  const onDeleteAccount = async () => {
    if (!user) return;

    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await user.delete();
              // The user will be signed out automatically and the root layout will redirect to the sign-in screen.
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", "Could not delete your account.");
            }
          },
        },
      ]
    );
  };

  if (!isLoaded || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
        {isEditing ? (
          <View style={styles.editNameContainer}>
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              style={[styles.input, styles.nameInput]}
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={[styles.input, styles.nameInput]}
            />
          </View>
        ) : (
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
        )}
        <Text style={styles.email}>
          {user.primaryEmailAddress?.emailAddress}
        </Text>
        <Text style={styles.phone}>{user.primaryPhoneNumber?.phoneNumber}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <Pressable
              onPress={onSave}
              style={styles.button}
              disabled={isSaving}
            >
              <Text style={styles.buttonText}>
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </Pressable>
            <Pressable
              onPress={onCancel}
              style={[styles.button, styles.secondaryButton]}
              disabled={isSaving}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Cancel
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable onPress={onEdit} style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => router.push("/settings")}
          style={[styles.button, styles.secondaryButton]}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            App Settings
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/account/change-password")}
          style={[styles.button, styles.secondaryButton]}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Change Password
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/account/two-factor-auth")}
          style={[styles.button, styles.secondaryButton]}
          disabled={user.twoFactorEnabled}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            {user.twoFactorEnabled
              ? "Two-Factor Authentication Enabled"
              : "Set Up Two-Factor Authentication"}
          </Text>
        </Pressable>
        <SignOutButton />
      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerZoneText}>Danger Zone</Text>
        <Pressable
          onPress={onDeleteAccount}
          style={[styles.button, styles.dangerButton]}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  phone: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  editNameContainer: {
    flexDirection: "row",
    gap: 10,
  },
  nameInput: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  secondaryButtonText: {
    color: "#007BFF",
  },
  dangerZone: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  dangerZoneText: {
    textAlign: "center",
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
  },
  dangerButton: {
    backgroundColor: "red",
  },
});

export default AccountScreen;
