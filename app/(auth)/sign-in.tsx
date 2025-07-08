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
} from "react-native";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [accountNotFound, setAccountNotFound] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignInPress = async () => {
    if (!isLoaded || loading) {
      return;
    }
    setLoading(true);

    // Reset previous error states
    setError(null);
    setAccountNotFound(false);

    try {
      // Start the sign-in process, asking for a phone number.
      // This will send an OTP to the user.
      const { supportedFirstFactors } = await signIn.create({
        identifier: phoneNumber,
      });

      if (supportedFirstFactors && supportedFirstFactors.length > 0) {
        const firstPhoneFactor: any = supportedFirstFactors.find(
          (factor: any) => factor.strategy === "phone_code"
        );

        if (firstPhoneFactor) {
          const { phoneNumberId } = firstPhoneFactor;

          await signIn.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumberId,
          });

          setPendingVerification(true);
        }
      }
    } catch (err: any) {
      console.error("Error starting sign in:", JSON.stringify(err, null, 2));
      const clerkError = err.errors?.[0];
      if (clerkError?.code === "form_identifier_not_found") {
        setError(clerkError.longMessage);
        setAccountNotFound(true);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || loading) {
      return;
    }
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });
      console.log("Sign in attempt result:", JSON.stringify(result, null, 2));

      const { createdSessionId } = result;

      if (createdSessionId) {
        // If the sign-in was successful, set the active session and redirect
        await setActive({ session: createdSessionId });
        router.push("/(tabs)");
      } else {
        // Handle cases where sign-in is not complete
        setError(
          "Could not complete sign in. Please check the code and try again."
        );
      }
    } catch (err: any) {
      console.error("Error verifying code:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.longMessage || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const onTryDifferentNumber = () => {
    setPhoneNumber("");
    setError(null);
    setAccountNotFound(false);
  };

  return (
    <View style={styles.container}>
      {!pendingVerification && !accountNotFound && (
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
            onPress={onSignInPress}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Link href="/sign-up" asChild>
            <TouchableOpacity style={styles.link}>
              <Text>Don't have an account? Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}

      {accountNotFound && (
        <View style={styles.form}>
          <Text style={styles.label}>Account Not Found</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Link
            href={{ pathname: "/sign-up", params: { phone: phoneNumber } }}
            asChild
          >
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            onPress={onTryDifferentNumber}
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Try a different number
            </Text>
          </TouchableOpacity>
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
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007BFF",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#007BFF",
  },
});
