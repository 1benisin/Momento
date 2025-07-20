import React, { useState, useEffect } from "react";
import { Modal, View, StyleSheet, Button, SafeAreaView } from "react-native";
import MapView, { Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Text } from "@/components/Themed";

interface MapViewModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (location: { latitude: number; longitude: number }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

const MapViewModal: React.FC<MapViewModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialLocation,
}) => {
  const [region, setRegion] = useState<Region | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (initialLocation) {
        setRegion({
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          // Default to a fallback location if permission denied
          setRegion({
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, [visible, initialLocation]);

  const handleConfirm = () => {
    if (region) {
      onConfirm({
        latitude: region.latitude,
        longitude: region.longitude,
      });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Drag Map to Set Location</Text>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation
          />
          <View style={styles.markerFixed}>
            <Ionicons name="location" size={40} color="#FF3B30" />
          </View>
        </View>
        <View style={styles.footer}>
          <Button title="Cancel" onPress={onClose} color="#FF3B30" />
          <Button title="Confirm Location" onPress={handleConfirm} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    left: "50%",
    marginLeft: -20, // Half of marker width
    marginTop: -40, // Half of marker height
    position: "absolute",
    top: "50%",
  },
  footer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});

export default MapViewModal;
