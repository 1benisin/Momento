import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

export default function AccountScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = React.useState(false);

  const onSignOutPress = async () => {
    setLoading(true);
    try {
      await signOut();
      // The user will be redirected to the sign-in screen automatically
    } catch (err) {
      console.error("Error signing out:", err);
      Alert.alert("Error", "Could not sign out.");
    } finally {
      setLoading(false);
    }
  };

  const onAddEmailPress = () => {
    // This would navigate to a new screen or show a modal
    // to handle the `user.createEmailAddress` flow.
    Alert.alert(
      "Add Email",
      "This feature is not yet implemented. It will allow you to add and verify an email address."
    );
  };

  const getPrimaryEmail = () => {
    return user?.primaryEmailAddress?.emailAddress || "No email added";
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Account Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.info}>{user?.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{getPrimaryEmail()}</Text>
        </View>

        {!user?.primaryEmailAddress && (
          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={onAddEmailPress}
          >
            <Text style={[styles.buttonText, styles.outlineButtonText]}>
              Add Email Address
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onSignOutPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign Out</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  info: {
    fontSize: 16,
    fontWeight: "500",
    maxWidth: "70%",
  },
  button: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  outlineButtonText: {
    color: "#007BFF",
  },
});
