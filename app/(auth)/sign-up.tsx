import { useSignUp } from "@clerk/clerk-expo";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [phoneNumber, setPhoneNumber] = React.useState(phone || "");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded || loading) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Create the user on Clerk
      await signUp.create({
        phoneNumber,
      });

      // Send verification code
      await signUp.preparePhoneNumberVerification();

      // Rerender to show the verification code input
      setPendingVerification(true);
    } catch (err: any) {
      console.error("Error signing up:", JSON.stringify(err, null, 2));
      setError(
        err.errors?.[0]?.longMessage || "An error occurred during sign up."
      );
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || loading) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const result = await signUp.attemptPhoneNumberVerification({
        code,
      });
      console.log("Sign up attempt result:", JSON.stringify(result, null, 2));

      const { createdSessionId } = result;

      if (createdSessionId) {
        // If the sign-up was successful, set the active session and redirect
        await setActive({ session: createdSessionId });
        router.push("/(tabs)");
      } else {
        // Handle cases where sign-up is not complete
        setError(
          "Could not complete sign up. Please check the code and try again."
        );
      }
    } catch (err: any) {
      console.error("Error verifying code:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.longMessage || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!pendingVerification && (
        <View style={styles.form}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="+1..."
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={onSignUpPress}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Link href="/sign-in" asChild>
            <TouchableOpacity style={styles.link}>
              <Text>Already have an account? Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
      {pendingVerification && (
        <View style={styles.form}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            value={code}
            placeholder="Code..."
            onChangeText={setCode}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={onVerifyPress}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}
    </View>
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
