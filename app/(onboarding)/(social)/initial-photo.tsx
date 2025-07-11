import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import ImageUploader from "../../../components/ImageUploader";
import { api } from "../../../convex/_generated/api";

export default function InitialPhotoScreen() {
  const router = useRouter();
  const addProfilePhoto = useMutation(api.user.addProfilePhoto);
  const completeOnboarding = useMutation(api.user.completeOnboarding);
  const [storageId, setStorageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const handleUploadSuccess = (newStorageId: string) => {
    setStorageId(newStorageId);
  };

  const onSave = async () => {
    if (!storageId) {
      Alert.alert(
        "Please upload a photo",
        "You must upload a photo to continue."
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await addProfilePhoto({ storageId, isAuthentic: false });
      // The root layout will now handle the navigation after the
      // user's status is updated by the addProfilePhoto mutation.
    } catch (error) {
      console.error("Failed to save profile photo:", error);
      Alert.alert(
        "Save Failed",
        "Could not save your photo. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSkip = async () => {
    setIsSkipping(true);
    try {
      await completeOnboarding();
      // Let the root layout handle the navigation
      // router.replace("/");
    } catch (error) {
      console.error("Failed to skip onboarding step:", error);
      Alert.alert("Error", "Could not complete onboarding. Please try again.");
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add your first photo</Text>
      <Text style={styles.subtitle}>
        This helps people recognize you. You can change it later.
      </Text>

      <ImageUploader onUploadSuccess={handleUploadSuccess} />

      <View style={styles.buttonContainer}>
        <Button
          title={isSubmitting ? "Saving..." : "Save and Finish"}
          onPress={onSave}
          disabled={!storageId || isSubmitting || isSkipping}
        />
        <TouchableOpacity
          onPress={onSkip}
          disabled={isSubmitting || isSkipping}
          style={styles.skipButton}
        >
          <Text style={styles.skipButtonText}>
            {isSkipping ? "Skipping..." : "Skip for now"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  skipButton: {
    marginTop: 15,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
});
