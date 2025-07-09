import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Switch,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import ImageUploader from "../../components/ImageUploader";
import { api } from "../../convex/_generated/api";

export default function InitialPhotoScreen() {
  const router = useRouter();
  const addProfilePhoto = useMutation(api.user.addProfilePhoto);
  const [isAuthentic, setIsAuthentic] = useState(false);
  const [storageId, setStorageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadSuccess = (newStorageId: string, authentic: boolean) => {
    setStorageId(newStorageId);
    setIsAuthentic(authentic);
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
      await addProfilePhoto({ storageId, isAuthentic });
      // On success, navigate to the root. The root layout will handle redirecting
      // the user to the main part of the app.
      router.replace("/");
    } catch (error) {
      console.error("Failed to save profile photo:", error);
      Alert.alert(
        "Save Failed",
        "Could not save your photo. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add your first photo</Text>

      <ImageUploader onUploadSuccess={handleUploadSuccess} />

      <Button
        title={isSubmitting ? "Saving..." : "Save and Finish"}
        onPress={onSave}
        disabled={!storageId || isSubmitting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
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
});
