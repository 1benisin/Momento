import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

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
      // Optionally, show an error message to the user
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const { createdSessionId } = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      if (createdSessionId) {
        // If the sign-in was successful, set the active session and redirect
        await setActive({ session: createdSessionId });
        router.push("/(tabs)");
      } else {
        // Handle cases where sign-in is not complete
        console.error("Could not complete sign in.");
      }
    } catch (err: any) {
      console.error("Error verifying code:", JSON.stringify(err, null, 2));
      // Optionally, show an error message to the user
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
          <TouchableOpacity onPress={onSignInPress} style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <Link href="/sign-up" asChild>
            <TouchableOpacity style={styles.link}>
              <Text>Don't have an account? Sign up</Text>
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
