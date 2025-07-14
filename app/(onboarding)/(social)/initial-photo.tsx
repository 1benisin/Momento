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
import { devLog } from "@/utils/devLog";
import { Id } from "@/convex/_generated/dataModel";

export default function InitialPhotoScreen() {
  const router = useRouter();
  const createSocialProfile = useMutation(api.user.createSocialProfile);
  const [storageId, setStorageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadSuccess = (newStorageId: string) => {
    setStorageId(newStorageId);
  };

  const handleContinue = () => {
    devLog("[InitialPhotoScreen] Navigating to social discover");
    router.replace("/(tabs)/(social)/discover");
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
      devLog("[InitialPhotoScreen] Calling createSocialProfile with photo");
      await createSocialProfile({
        initialPhoto: {
          storageId: storageId as Id<"_storage">,
          isAuthentic: false,
        },
      });
      handleContinue();
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

  const onSkip = async () => {
    setIsSubmitting(true);
    try {
      devLog("[InitialPhotoScreen] Calling createSocialProfile without photo");
      await createSocialProfile({}); // Call with empty object
      handleContinue();
    } catch (error) {
      console.error("Failed to create social profile on skip:", error);
      Alert.alert("Skip Failed", "Could not skip this step. Please try again.");
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
        <View style={{ marginVertical: 8 }}>
          <Button
            title="Skip for now"
            onPress={onSkip}
            color="grey"
            disabled={isSubmitting}
          />
        </View>
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
