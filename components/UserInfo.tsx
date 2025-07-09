import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Text, View, ActivityIndicator, Image, StyleSheet } from "react-native";

export default function UserInfo() {
  const user = useQuery(api.user.me);

  if (user === undefined) {
    return <ActivityIndicator />;
  }

  if (user === null) {
    return <Text>User not found</Text>;
  }

  return (
    <View style={styles.container}>
      {user.socialProfile?.current_photo_url && (
        <Image
          source={{ uri: user.socialProfile.current_photo_url }}
          style={styles.profilePhoto}
        />
      )}
      <Text style={styles.greeting}>
        Hi, {user.socialProfile?.first_name || user.phone_number}!
      </Text>
      <Text>Your status is: {user.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
