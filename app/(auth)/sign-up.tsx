import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

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
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const { createdSessionId } = await signUp.attemptPhoneNumberVerification({
        code,
      });

      if (createdSessionId) {
        // If the sign-up was successful, set the active session and redirect
        await setActive({ session: createdSessionId });
        router.push("/(tabs)");
      } else {
        // Handle cases where sign-up is not complete
        console.error("Could not complete sign up.");
      }
    } catch (err: any) {
      console.error("Error verifying code:", JSON.stringify(err, null, 2));
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
          <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
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
});
