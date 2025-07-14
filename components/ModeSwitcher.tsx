import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Text } from "./Themed";
import Colors from "@/constants/Colors";
import { UserRole } from "@/convex/schema";

interface ModeSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const tintColor = Colors[colorScheme].tint;
  const selectedTextColor =
    colorScheme === "light" ? Colors.dark.text : Colors.light.text;

  return (
    <View style={[styles.container, { borderColor: tintColor }]}>
      <TouchableOpacity
        style={[
          styles.button,
          currentRole === "social" && { backgroundColor: tintColor },
        ]}
        onPress={() => onRoleChange("social")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                currentRole === "social"
                  ? selectedTextColor
                  : Colors[colorScheme].text,
            },
          ]}
        >
          Social
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          currentRole === "host" && { backgroundColor: tintColor },
        ]}
        onPress={() => onRoleChange("host")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                currentRole === "host"
                  ? selectedTextColor
                  : Colors[colorScheme].text,
            },
          ]}
        >
          Host
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ModeSwitcher;
