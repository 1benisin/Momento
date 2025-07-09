import { useUser } from "@clerk/clerk-expo";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function TwoFactorAuthScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isEnabling, setIsEnabling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (user?.twoFactorEnabled) {
      // User already has 2FA, maybe show a disable screen?
      // For now, let's assume we handle this with a different UI state.
    }
  }, [user]);

  const onEnable = async () => {
    if (!user) return;
    setIsEnabling(true);
    try {
      const totp = await user.createTOTP();
      if (totp.uri) {
        setQRCode(totp.uri);
      } else {
        throw new Error("Could not generate QR code URI.");
      }
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      Alert.alert("Error", "Could not set up Two-Factor Authentication.");
    } finally {
      setIsEnabling(false);
    }
  };

  const onVerify = async () => {
    if (!user) return;
    setIsVerifying(true);
    try {
      await user.verifyTOTP({ code });
      Alert.alert("Success", "Two-Factor Authentication has been enabled.");
      router.back();
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
      Alert.alert("Error", "The code is invalid. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two-Factor Authentication</Text>
      {!qrCode && (
        <>
          <Text style={styles.description}>
            Add an extra layer of security to your account by enabling 2FA.
          </Text>
          <Button
            title={isEnabling ? "Generating..." : "Enable 2FA"}
            onPress={onEnable}
            disabled={isEnabling}
          />
        </>
      )}

      {qrCode && (
        <>
          <Text style={styles.description}>
            Scan the QR code with your authenticator app (e.g., Google
            Authenticator, Authy).
          </Text>
          <Image source={{ uri: qrCode }} style={styles.qrCode} />
          <TextInput
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            style={styles.input}
            keyboardType="numeric"
          />
          <Button
            title={isVerifying ? "Verifying..." : "Verify & Complete"}
            onPress={onVerify}
            disabled={isVerifying}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  qrCode: {
    width: 250,
    height: 250,
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
