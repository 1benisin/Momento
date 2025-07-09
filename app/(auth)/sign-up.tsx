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
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [signUpMethod, setSignUpMethod] = React.useState<"email" | "phone">(
    "email"
  );
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // --- Handlers ---

  const onSignUpPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);

    try {
      if (signUpMethod === "email") {
        await signUp.create({ emailAddress, password });
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
      } else {
        await signUp.create({ phoneNumber });
        await signUp.preparePhoneNumberVerification();
      }
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
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);

    try {
      const verificationFunction =
        signUpMethod === "email"
          ? signUp.attemptEmailAddressVerification
          : signUp.attemptPhoneNumberVerification;

      const result = await verificationFunction({ code });

      if (result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push("/(tabs)");
      } else {
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

  const onBackPress = () => {
    setPendingVerification(false);
    setCode("");
    setError(null);
  };

  // --- Render ---

  const renderSignUpForm = () => (
    <>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, signUpMethod === "email" && styles.activeTab]}
          onPress={() => setSignUpMethod("email")}
        >
          <Text style={styles.tabText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, signUpMethod === "phone" && styles.activeTab]}
          onPress={() => setSignUpMethod("phone")}
        >
          <Text style={styles.tabText}>Phone</Text>
        </TouchableOpacity>
      </View>

      {signUpMethod === "email" ? (
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
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
        </>
      ) : (
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
      )}

      <TouchableOpacity
        onPress={onSignUpPress}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Link href="/sign-in" asChild>
        <TouchableOpacity style={styles.link}>
          <Text>Already have an account? Sign in</Text>
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
        {pendingVerification ? renderVerificationForm() : renderSignUpForm()}
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
