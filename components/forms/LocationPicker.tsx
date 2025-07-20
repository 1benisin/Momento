import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/Themed";
import LocationSearchInput from "./LocationSearchInput";
import MapViewModal from "./MapViewModal";

export interface LocationData {
  address?: string;
  name: string;
  latitude: number;
  longitude: number;
  googlePlaceId?: string;
}

interface LocationPickerProps {
  onLocationChange: (location: LocationData) => void;
  initialLocation?: LocationData;
  renderKey: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationChange,
  initialLocation,
  renderKey,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );
  const [isMapVisible, setMapVisible] = useState(false);

  const handleLocationSelect = (details: any) => {
    if (!details) return;

    const location: LocationData = {
      address: details.formatted_address,
      name: details.name || details.formatted_address || "Pinned Location",
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      googlePlaceId: details.place_id,
    };
    setSelectedLocation(location);
    onLocationChange(location);
  };

  const handlePinConfirm = (coords: {
    latitude: number;
    longitude: number;
  }) => {
    const location: LocationData = {
      ...coords,
      name: `Pinned Location`,
      address: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
    };
    setSelectedLocation(location);
    onLocationChange(location);
    setMapVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>
      <LocationSearchInput
        renderKey={renderKey}
        onLocationSelect={handleLocationSelect}
        onPressPin={() => setMapVisible(true)}
      />
      {selectedLocation && (
        <View style={styles.selectionDisplay}>
          <Text style={styles.selectionName}>{selectedLocation.name}</Text>
          <Text style={styles.selectionAddress}>
            {selectedLocation.address}
          </Text>
        </View>
      )}
      <MapViewModal
        visible={isMapVisible}
        onClose={() => setMapVisible(false)}
        onConfirm={handlePinConfirm}
        initialLocation={
          selectedLocation
            ? {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }
            : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    position: "relative",
    minHeight: 300,
    width: "100%",
    overflow: "visible",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  selectionDisplay: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  selectionName: {
    fontWeight: "bold",
  },
  selectionAddress: {
    marginTop: 3,
    color: "#555",
  },
});

export default LocationPicker;
