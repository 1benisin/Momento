import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Text, View, ActivityIndicator, Image, StyleSheet } from "react-native";

export default function UserInfo() {
  const { user, isLoaded } = useUser();
  const convexUser = useQuery(api.user.me);

  const isLoading = !isLoaded || convexUser === undefined;

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!user || convexUser === null) {
    return <Text>User not found</Text>;
  }

  return (
    <View style={styles.container}>
      {user.imageUrl && (
        <Image source={{ uri: user.imageUrl }} style={styles.profilePhoto} />
      )}
      <Text style={styles.greeting}>
        Hi, {user.firstName || user.primaryEmailAddress?.emailAddress}!
      </Text>
      <Text>Your status is: {convexUser.status}</Text>
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
