import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import ImageUploader from "../../../components/ImageUploader";
import { api } from "../../../convex/_generated/api";

export default function InitialPhotoScreen() {
  const router = useRouter();
  const createSocialProfile = useMutation(api.user.createSocialProfile);
  const [storageId, setStorageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createSocialProfile({
        initialPhoto: { storageId, isAuthentic: false },
      });
      router.replace("/(tabs)/(social)/discover");
    } catch (error) {
      console.error("Failed to create social profile:", error);
      Alert.alert(
        "Save Failed",
        "Could not save your profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
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
          disabled={!storageId || isSubmitting}
        />
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
});
