import { useClerk } from "@clerk/clerk-expo";
import React from "react";
import { Button } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  return (
    <Button
      title="Sign Out"
      onPress={() => {
        signOut();
      }}
    />
  );
};
