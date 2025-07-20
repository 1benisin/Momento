import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { devLog } from "@/utils/devLog";

// This will come from your environment variables
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

devLog("[LocationSearchInput] GOOGLE_MAPS_API_KEY", GOOGLE_MAPS_API_KEY);

if (!GOOGLE_MAPS_API_KEY) {
  console.error(
    "Google Maps API key is not provided. Please set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your environment."
  );
}

interface LocationSearchInputProps {
  onLocationSelect: (details: any) => void;
  onPressPin: () => void;
  renderKey: string;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  onLocationSelect,
  onPressPin,
  renderKey,
}) => {
  devLog("[LocationSearchInput] Render", { renderKey, GOOGLE_MAPS_API_KEY });
  if (!GOOGLE_MAPS_API_KEY) {
    devLog("[LocationSearchInput] No API key, not rendering");
    return null; // Or render a placeholder/error message
  }

  devLog("[LocationSearchInput] Rendering GooglePlacesAutocomplete", {
    query: {
      key: GOOGLE_MAPS_API_KEY,
      language: "en",
    },
    renderKey,
  });

  return (
    <View style={styles.outerContainer}>
      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          key={renderKey}
          placeholder="Search for an address or business"
          onPress={(data, details = null) => {
            devLog("[LocationSearchInput] onPress", { data, details });
            onLocationSelect(details);
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "en",
          }}
          fetchDetails={true}
          predefinedPlaces={[]}
          textInputProps={{}}
          styles={{
            textInput: styles.input,
            container: styles.autocompleteContainer,
            listView: styles.listView,
          }}
        />
        <TouchableOpacity onPress={onPressPin} style={styles.pinButton}>
          <Ionicons name="map-outline" size={24} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "relative",
    minHeight: 300,
    width: "100%",
    overflow: "visible",
  },
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  autocompleteContainer: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 44,
    width: "100%",
    backgroundColor: "#fff",
  },
  listView: {
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007AFF",
    zIndex: 1000,
    elevation: 10,
    maxHeight: 200,
    overflow: "visible",
  },
  pinButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1100,
    backgroundColor: "transparent",
  },
});

export default LocationSearchInput;
