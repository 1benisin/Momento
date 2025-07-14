import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
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
import { UserRole, AccountStatuses } from "@/convex/schema";
import { useAuth } from "@clerk/clerk-expo";
import { Text } from "@/components/Themed";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const allTabs: {
  name: string;
  title: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  role: UserRole;
}[] = [
  // Social Tabs
  {
    name: "(social)/discover",
    title: "Discover",
    icon: "compass",
    role: "social",
  },
  {
    name: "(social)/events",
    title: "Events",
    icon: "calendar",
    role: "social",
  },
  {
    name: "(social)/memory-book",
    title: "Memory Book",
    icon: "book",
    role: "social",
  },
  {
    name: "(social)/social-profile",
    title: "Profile",
    icon: "user",
    role: "social",
  },
  // Host Tabs
  {
    name: "(host)/dashboard",
    title: "Dashboard",
    icon: "tachometer",
    role: "host",
  },
  { name: "(host)/events", title: "Events", icon: "calendar", role: "host" },
  { name: "(host)/inbox", title: "Inbox", icon: "inbox", role: "host" },
  { name: "(host)/host-profile", title: "Profile", icon: "user", role: "host" },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const user = useQuery(api.user.me);
  const { signOut } = useAuth();

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const isHybridUser = !!user?.socialProfile && !!user?.hostProfile;
  let effectiveRole: UserRole | null = null;

  if (isHybridUser) {
    effectiveRole = user?.active_role || "social";
  } else if (user?.socialProfile) {
    effectiveRole = "social";
  } else if (user?.hostProfile) {
    effectiveRole = "host";
  }

  const isPaused = user?.accountStatus === AccountStatuses.PAUSED;

  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (!effectiveRole) {
    // This can happen if user has no profile yet (still in onboarding)
    // or if there is an issue with the user document.
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <Menu>
              <MenuTrigger>
                <View style={styles.menuTrigger}>
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
                      style={styles.pausedIcon}
                    />
                  )}
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={menuOptionsStyles}>
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
      {allTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name as any}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={tab.icon} color={color} />
            ),
            href: effectiveRole === tab.role ? undefined : null,
          }}
        />
      ))}
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const menuOptionsStyles = {
  optionsContainer: {
    borderRadius: 10,
    marginTop: 30,
    width: 160,
  },
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingRight: 15,
  },
  menuTrigger: {
    flexDirection: "row",
    alignItems: "center",
  },
  pausedIcon: {
    position: "absolute",
    right: -2,
    top: -2,
  },
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
