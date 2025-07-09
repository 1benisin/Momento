import React, { useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  Text,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

interface ImageUploaderProps {
  onUploadSuccess: (storageId: string, isAuthentic: boolean) => void;
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleImageUpload = async (uri: string, isAuthentic: boolean) => {
    setIsUploading(true);
    try {
      // Step 1: Get a short-lived upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await uploadResponse.json();

      // Step 3: Pass the storageId to the parent component
      onUploadSuccess(storageId, isAuthentic);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Upload Failed",
        "Sorry, we couldn't upload your image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant camera roll permissions to select an image.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await handleImageUpload(uri, false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant camera permissions to take a photo.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await handleImageUpload(uri, true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add a Profile Photo</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Pick an image from camera roll"
          onPress={pickImage}
          disabled={isUploading}
        />
        <View style={styles.spacer} />
        <Button
          title="Take a photo"
          onPress={takePhoto}
          disabled={isUploading}
        />
      </View>

      {isUploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Uploading...</Text>
        </View>
      )}

      {image && !isUploading && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  spacer: {
    height: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, // Make it a circle
    borderWidth: 2,
    borderColor: "#ccc",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
