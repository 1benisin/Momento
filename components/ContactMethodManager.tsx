import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import type { EmailAddressResource, PhoneNumberResource } from "@clerk/types";

type ContactMethodManagerProps = {
  methodType: "email" | "phone";
};

type Flow = "idle" | "adding" | "verifying";

const ContactMethodManager = ({ methodType }: ContactMethodManagerProps) => {
  const { user, isLoaded } = useUser();
  const [flow, setFlow] = useState<Flow>("idle");
  const [newItem, setNewItem] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // A reference to the email/phone resource that is being verified
  const [verifyingResource, setVerifyingResource] = useState<
    EmailAddressResource | PhoneNumberResource | null
  >(null);

  const isEmail = methodType === "email";
  const contactMethods = isEmail ? user?.emailAddresses : user?.phoneNumbers;

  if (!isLoaded) {
    return <ActivityIndicator />;
  }

  const handleAdd = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      let resource;
      if (isEmail) {
        resource = await user.createEmailAddress({ email: newItem });
        await resource.prepareVerification({ strategy: "email_code" });
      } else {
        resource = await user.createPhoneNumber({ phoneNumber: newItem });
        await resource.prepareVerification();
      }
      setVerifyingResource(resource);
      setFlow("verifying");
    } catch (err: any) {
      console.error(
        "Error adding contact method:",
        JSON.stringify(err, null, 2)
      );
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "An unknown error occurred."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyingResource) return;
    setIsProcessing(true);
    try {
      // 1. Attempt verification
      const result = await verifyingResource.attemptVerification({
        code: verificationCode,
      });

      // 2. On success, perform the "Safe Swap"
      if (result.verification.status === "verified") {
        // Find the old primary method and destroy it.
        // Clerk will automatically promote the new one.
        if (isEmail) {
          const oldPrimary = user?.primaryEmailAddress;
          if (oldPrimary && oldPrimary.id !== verifyingResource.id) {
            await oldPrimary.destroy();
          }
        } else {
          const oldPrimary = user?.primaryPhoneNumber;
          if (oldPrimary && oldPrimary.id !== verifyingResource.id) {
            await oldPrimary.destroy();
          }
        }

        // 3. Reset UI state
        Alert.alert(
          "Success",
          `${isEmail ? "Email" : "Phone"} updated successfully.`
        );
        setFlow("idle");
        setNewItem("");
        setVerificationCode("");
        setVerifyingResource(null);
      } else {
        console.log(
          "Verification status is not complete:",
          result.verification.status
        );
      }
    } catch (err: any) {
      console.error(
        "Error verifying contact method:",
        JSON.stringify(err, null, 2)
      );
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "An unknown error occurred."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getVerificationStatus = (
    method: EmailAddressResource | PhoneNumberResource
  ) => {
    return method.verification.status;
  };

  const getIdentifier = (
    method: EmailAddressResource | PhoneNumberResource
  ) => {
    return isEmail
      ? (method as EmailAddressResource).emailAddress
      : (method as PhoneNumberResource).phoneNumber;
  };

  const renderIdleState = () => {
    const primaryMethod = isEmail
      ? user?.primaryEmailAddress
      : user?.primaryPhoneNumber;
    const identifier = primaryMethod ? getIdentifier(primaryMethod) : null;

    return (
      <>
        {identifier ? (
          <View style={styles.methodRow}>
            <Text style={styles.methodIdentifier}>{identifier}</Text>
            <Text style={styles.statusText}>Verified</Text>
          </View>
        ) : (
          <Text style={styles.infoText}>
            No {isEmail ? "email" : "phone"} added.
          </Text>
        )}
        <Pressable style={styles.button} onPress={() => setFlow("adding")}>
          <Text style={styles.buttonText}>
            {identifier ? "Change" : "Add"} {isEmail ? "Email" : "Phone"}
          </Text>
        </Pressable>
      </>
    );
  };

  const renderAddingState = () => (
    <View>
      <TextInput
        placeholder={isEmail ? "Enter email address" : "Enter phone number"}
        value={newItem}
        onChangeText={setNewItem}
        style={styles.input}
        autoCapitalize="none"
      />
      <Pressable
        style={styles.button}
        onPress={handleAdd}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? "Adding..." : "Add"}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setFlow("idle")}
        disabled={isProcessing}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Cancel
        </Text>
      </Pressable>
    </View>
  );

  const renderVerifyingState = () => (
    <View>
      <Text style={styles.infoText}>
        A verification code has been sent to {newItem}. Please enter it below.
      </Text>
      <TextInput
        placeholder="Verification code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        style={styles.input}
      />
      <Pressable
        style={styles.button}
        onPress={handleVerify}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? "Verifying..." : "Verify"}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setFlow("adding")}
        disabled={isProcessing}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Back
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEmail ? "Email Address" : "Phone Number"}
      </Text>
      {flow === "idle" && renderIdleState()}
      {flow === "adding" && renderAddingState()}
      {flow === "verifying" && renderVerifyingState()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  listContainer: {
    marginBottom: 15,
  },
  methodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  methodIdentifier: {
    fontSize: 16,
  },
  statusText: {
    fontSize: 14,
    color: "#6B7280",
    textTransform: "capitalize",
  },
  infoText: {
    marginBottom: 10,
    color: "#374151",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  secondaryButtonText: {
    color: "#3B82F6",
  },
  addButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ContactMethodManager;
