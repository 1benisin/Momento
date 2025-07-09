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
  const [password, setPassword] = React.useState("");
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
      if (signInMethod === "email") {
        const result = await signIn.create({
          identifier: emailAddress,
          password,
        });
        if (result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          router.push("/(tabs)");
        } else {
          // This can happen if the user has 2FA enabled, for example.
          // For this story, we'll treat it as an error.
          setError("Sign in failed. Please check your credentials.");
        }
      } else {
        const { supportedFirstFactors } = await signIn.create({
          identifier: phoneNumber,
        });

        if (supportedFirstFactors?.some((f) => f.strategy === "phone_code")) {
          const firstPhoneFactor: any = supportedFirstFactors.find(
            (factor: any) => factor.strategy === "phone_code"
          );
          const { phoneNumberId } = firstPhoneFactor;
          await signIn.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumberId,
          });
          setPendingVerification(true);
        }
      }
    } catch (err: any) {
      console.error("Error signing in:", JSON.stringify(err, null, 2));
      setError(
        err.errors?.[0]?.longMessage || "An error occurred during sign in."
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
      const result = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

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

  // --- Render ---

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.form}>
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
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.form}>
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
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
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

        <View style={styles.linkRow}>
          <Link href="/sign-up" asChild>
            <TouchableOpacity style={styles.link}>
              <Text>Don't have an account? Sign up</Text>
            </TouchableOpacity>
          </Link>
          {signInMethod === "email" && (
            <Link href="./forgot-password" asChild>
              <TouchableOpacity style={styles.link}>
                <Text>Forgot password?</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
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
  linkRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
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
