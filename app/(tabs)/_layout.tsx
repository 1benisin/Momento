import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Tabs, useRouter } from "expo-router";
import { Pressable, View, Text, StyleSheet } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserStatuses } from "@/convex/schema";
import { useAuth } from "@clerk/clerk-expo";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const convexUser = useQuery(api.user.me);
  const { signOut } = useAuth();

  const isPaused = convexUser?.status === UserStatuses.PAUSED;

  const onSignOutPress = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerRight: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              paddingRight: 15,
            }}
          >
            <Menu>
              <MenuTrigger>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome
                    name="user-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                  {isPaused && (
                    <FontAwesome
                      name="exclamation-triangle"
                      size={14}
                      color="gold"
                      style={{ position: "absolute", right: -2, top: -2 }}
                    />
                  )}
                </View>
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    borderRadius: 10,
                    marginTop: 30,
                    width: 160,
                  },
                }}
              >
                <MenuOption onSelect={() => router.push("/account")}>
                  <View style={styles.accountMenuOption}>
                    <Text style={styles.menuItemTextNaked}>Account</Text>
                    {isPaused && (
                      <FontAwesome
                        name="exclamation-triangle"
                        size={16}
                        color="gold"
                      />
                    )}
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => router.push("/settings")}>
                  <Text style={styles.menuItemText}>Settings</Text>
                </MenuOption>
                <MenuOption onSelect={() => router.push("/social-profile")}>
                  <Text style={styles.menuItemText}>Social Profile</Text>
                </MenuOption>
                <View style={styles.separator} />
                <MenuOption onSelect={onSignOutPress}>
                  <Text style={[styles.menuItemText, { color: "red" }]}>
                    Sign Out
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="memory-book"
        options={{
          title: "Memory Book",
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="social-profile"
        options={{
          title: "Social Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  accountMenuOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  menuItemText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
  },
  menuItemTextNaked: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
});
