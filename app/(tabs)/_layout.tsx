import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Tabs, useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserStatuses } from "@/convex/schema";

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

  const isPaused = convexUser?.status === UserStatuses.PAUSED;

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
            <View>
              <Pressable onPress={() => router.push("/account")}>
                {({ pressed }) => (
                  <FontAwesome
                    name="user-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
              {isPaused && (
                <FontAwesome
                  name="pause-circle"
                  size={14}
                  color="orange"
                  style={{ position: "absolute", right: -2, top: -2 }}
                />
              )}
            </View>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
