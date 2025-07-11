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
import ContactMethodManager from "@/components/ContactMethodManager";

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

  const onUnpauseAccount = async () => {
    try {
      await unpauseAccount();
    } catch (error) {
      console.error("Error unpausing account:", error);
      Alert.alert("Error", "Could not unpause your account.");
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

      <View style={styles.contactMethodsContainer}>
        <ContactMethodManager methodType="email" />
        <ContactMethodManager methodType="phone" />
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
        <SignOutButton />
      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerZoneText}>Danger Zone</Text>
        <Pressable
          onPress={isPaused ? onUnpauseAccount : onPauseAccount}
          style={[styles.button, styles.warningButton, { marginBottom: 10 }]}
        >
          <Text style={[styles.buttonText, styles.warningButtonText]}>
            {isPaused ? "Unpause Account" : "Pause Account"}
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
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  contactMethodsContainer: {
    width: "80%",
    marginTop: 20,
    gap: 20,
  },
  pausedBanner: {
    width: "100%",
    backgroundColor: "orange",
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  pausedBannerText: {
    color: "white",
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editNameContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  nameInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  phone: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  statusText: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
  dangerZone: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    width: "80%",
    paddingTop: 20,
    alignItems: "center",
  },
  dangerZoneText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D93F33",
    marginBottom: 10,
  },
  warningButton: {
    backgroundColor: "#E59400",
    borderColor: "#E59400",
  },
  warningButtonText: {
    color: "#fff",
  },
  dangerButton: {
    backgroundColor: "#D93F33",
    borderColor: "#D93F33",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default AccountScreen;
