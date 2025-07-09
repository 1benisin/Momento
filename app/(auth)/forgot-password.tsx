import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const [successfulCreation, setSuccessfulCreation] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onRequestReset = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      console.error(
        "Error requesting password reset:",
        JSON.stringify(err, null, 2)
      );
      setError(err.errors?.[0]?.longMessage || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      console.log("Password reset result:", result);
      alert("Password reset successfully!");
      router.back();
    } catch (err: any) {
      console.error("Error resetting password:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.longMessage || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.form}>
        {!successfulCreation ? (
          <>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.description}>
              Enter your email address and we'll send you a code to reset your
              password.
            </Text>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="email@example.com"
              value={emailAddress}
              onChangeText={setEmailAddress}
              style={styles.input}
              keyboardType="email-address"
            />
            <TouchableOpacity
              onPress={onRequestReset}
              style={styles.button}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Code</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.description}>
              We've sent a password reset code to your email address.
            </Text>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              value={code}
              placeholder="Code..."
              style={styles.input}
              onChangeText={setCode}
            />
            <Text style={styles.label}>New Password</Text>
            <TextInput
              placeholder="New password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={onReset}
              style={styles.button}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Set New Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Link href="/sign-in" asChild>
          <TouchableOpacity style={styles.link}>
            <Text>Back to Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  form: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: "100%",
    borderRadius: 5,
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
  link: {
    marginTop: 15,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
