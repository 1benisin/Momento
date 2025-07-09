import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignOutButton } from "@/components/SignOutButton";
import { UserStatuses } from "@/convex/schema";

const AccountScreen = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const convexUser = useQuery(api.user.me);
  const pauseAccount = useMutation(api.user.pauseAccount);
  const unpauseAccount = useMutation(api.user.unpauseAccount);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const onPauseAccount = async () => {
    Alert.alert(
      "Pause Account",
      "Pausing your account will hide your profile from others and stop all non-critical notifications. You can reactivate it at any time. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pause",
          style: "destructive",
          onPress: async () => {
            try {
              await pauseAccount();
              // The root layout will handle showing the paused banner.
            } catch (error) {
              console.error("Error pausing account:", error);
              Alert.alert("Error", "Could not pause your account.");
            }
          },
        },
      ]
    );
  };

  const onReactivateAccount = async () => {
    try {
      await unpauseAccount();
    } catch (error) {
      console.error("Error reactivating account:", error);
      Alert.alert("Error", "Could not reactivate your account.");
    }
  };

  const onDeleteAccount = async () => {
    if (!user) return;

    Alert.alert(
      "Are you sure?",
      "Pausing your account hides your profile and stops notifications. Deleting is permanent and cannot be undone. We recommend pausing if you just need a break.",
      [
        {
          text: "Pause Account",
          onPress: onPauseAccount,
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await user.delete();
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", "Could not delete your account.");
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const isLoading = !isLoaded || convexUser === undefined;
  const isPaused = convexUser?.status === UserStatuses.PAUSED;

  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
      {isPaused && (
        <Pressable onPress={() => scrollViewRef.current?.scrollToEnd()}>
          <View style={styles.pausedBanner}>
            <Text style={styles.pausedBannerText}>
              Your account is currently paused. Tap to manage.
            </Text>
          </View>
        </Pressable>
      )}
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
        {convexUser?.status && (
          <Text style={styles.statusText}>
            Status:{" "}
            {convexUser.status.charAt(0).toUpperCase() +
              convexUser.status.slice(1)}
          </Text>
        )}
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
          onPress={isPaused ? onReactivateAccount : onPauseAccount}
          style={[styles.button, styles.warningButton, { marginBottom: 10 }]}
        >
          <Text style={[styles.buttonText, styles.warningButtonText]}>
            {isPaused ? "Reactivate Account" : "Pause Account"}
          </Text>
        </Pressable>
        <Pressable
          onPress={onDeleteAccount}
          style={[styles.button, styles.dangerButton]}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  pausedBanner: {
    backgroundColor: "#FFFBEA",
    borderColor: "#FACC15",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  pausedBannerText: {
    color: "#B45309",
    fontWeight: "500",
    textAlign: "center",
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
  statusText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    fontWeight: "bold",
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
    color: "#B45309",
    marginBottom: 10,
    fontWeight: "bold",
  },
  dangerButton: {
    backgroundColor: "red",
  },
  warningButton: {
    backgroundColor: "#FACC15",
  },
  warningButtonText: {
    color: "#422006",
  },
});

export default AccountScreen;
