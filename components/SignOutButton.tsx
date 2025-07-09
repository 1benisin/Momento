import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { Button } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useAuth();
  return (
    <Button
      title="Sign Out"
      onPress={() => {
        signOut();
      }}
    />
  );
};
