import React, { useState } from "react";
import { StyleSheet, TextInput, Button } from "react-native";
import { Text, View } from "@/components/Themed";
import { Doc, Id } from "@/convex/_generated/dataModel";

export type ItineraryItem = Omit<
  Doc<"events">["itinerary"][number],
  "location_id"
> & {
  location_id?: Id<"locations">;
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
};

export type FrontendEvent = Omit<Partial<Doc<"events">>, "itinerary"> & {
  itinerary?: ItineraryItem[];
};
interface EventItineraryFormProps {
  event: FrontendEvent;
  setEvent: (event: FrontendEvent) => void;
}

const EventItineraryForm: React.FC<EventItineraryFormProps> = ({
  event,
  setEvent,
}) => {
  const [locationName, setLocationName] = useState("");

  const handleAddItem = () => {
    if (!locationName) {
      alert("Please enter a location name.");
      return;
    }
    const newItem = {
      order: event.itinerary ? event.itinerary.length + 1 : 1,
      title: locationName, // Use location name as title for now
      description: "",
      start_time: 0,
      end_time: 0,
      location: {
        name: locationName,
        // Using placeholder coordinates. A real implementation
        // would get these from the Google Places API.
        latitude: 0,
        longitude: 0,
      },
    };
    const newItinerary = [...(event.itinerary || []), newItem];
    setEvent({ ...event, itinerary: newItinerary });
    setLocationName(""); // Clear the input
  };

  return (
    <View>
      <Text style={styles.label}>Itinerary</Text>
      {/* Placeholder for Google Places Autocomplete */}
      <TextInput
        style={styles.input}
        placeholder="Search for a location..."
        value={locationName}
        onChangeText={setLocationName}
      />

      <Button title="Add Stop" onPress={handleAddItem} />

      {event.itinerary?.map((item, index) => (
        <View key={index} style={styles.itineraryItem}>
          <Text>
            Stop {item.order}: {item.title}
          </Text>
          {/* Add more fields for itinerary item details here */}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
  itineraryItem: {
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
  },
});

export default EventItineraryForm;
