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

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [signInMethod, setSignInMethod] = React.useState<"email" | "phone">(
    "phone"
  );
  const [emailAddress, setEmailAddress] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // --- Handlers ---

  const onSignInPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);

    try {
      const identifier = signInMethod === "email" ? emailAddress : phoneNumber;
      const { supportedFirstFactors } = await signIn.create({ identifier });

      const firstFactor: any = supportedFirstFactors?.find((f) => {
        return signInMethod === "email"
          ? f.strategy === "email_code"
          : f.strategy === "phone_code";
      });

      if (firstFactor) {
        if (signInMethod === "email") {
          const { emailAddressId } = firstFactor;
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId,
          });
        } else {
          const { phoneNumberId } = firstFactor;
          await signIn.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumberId,
          });
        }
        setPendingVerification(true);
      } else {
        // This can happen if the user's primary contact method in Clerk
        // does not match the selected sign-in method.
        setError(
          `This account does not have a verified ${signInMethod}. Please try another method.`
        );
      }
    } catch (err: any) {
      console.error("Error signing in:", JSON.stringify(err, null, 2));
      const defaultMessage = "An error occurred during sign in.";
      // Customize error for "not found" which is common
      if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError(
          `We couldn't find an account with that ${signInMethod}. Please sign up.`
        );
      } else {
        setError(err.errors?.[0]?.longMessage || defaultMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);

    try {
      const strategy = signInMethod === "email" ? "email_code" : "phone_code";
      const result = await signIn.attemptFirstFactor({ strategy, code });

      if (result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push("/(tabs)");
      } else {
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

  const onBackPress = () => {
    setPendingVerification(false);
    setCode("");
    setError(null);
  };

  // --- Render ---

  const renderSignInForm = () => (
    <>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, signInMethod === "phone" && styles.activeTab]}
          onPress={() => setSignInMethod("phone")}
        >
          <Text style={styles.tabText}>Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, signInMethod === "email" && styles.activeTab]}
          onPress={() => setSignInMethod("email")}
        >
          <Text style={styles.tabText}>Email</Text>
        </TouchableOpacity>
      </View>

      {signInMethod === "phone" ? (
        <>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="+1..."
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="email@example.com"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.input}
            keyboardType="email-address"
          />
        </>
      )}

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
    </>
  );

  const renderVerificationForm = () => (
    <>
      <Text style={styles.label}>Verification Code</Text>
      <TextInput
        value={code}
        placeholder="Code..."
        onChangeText={setCode}
        style={styles.input}
        keyboardType="numeric"
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
      <TouchableOpacity
        onPress={onBackPress}
        style={[styles.button, styles.secondaryButton]}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Back
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.form}>
        {pendingVerification ? renderVerificationForm() : renderSignInForm()}
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
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007BFF",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#007BFF",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007BFF",
  },
  tabText: {
    fontSize: 16,
  },
});
