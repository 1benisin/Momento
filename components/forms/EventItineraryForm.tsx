import React, { useState, useMemo } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { Doc, Id } from "@/convex/_generated/dataModel";
import CustomTimePicker from "./CustomTimePicker";
import LocationPicker, { LocationData } from "./LocationPicker";

export type ItineraryItem = Omit<
  Doc<"events">["itinerary"][number],
  "location_id"
> & {
  location_id?: Id<"locations">;
  location: LocationData;
  // Add missing properties to satisfy form usage
  title: string;
  order: number;
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
  const [showTimePickerIdx, setShowTimePickerIdx] = useState<number | null>(
    null
  );

  const pickerDate = useMemo(() => {
    if (showTimePickerIdx === null) {
      return new Date(); // Default value, not used when picker is hidden
    }
    const item = (event.itinerary ?? [])[showTimePickerIdx];
    return new Date(item?.start_time || Date.now());
  }, [showTimePickerIdx, event.itinerary]);

  const handleAddItem = () => {
    const newItem: ItineraryItem = {
      order: (event.itinerary?.length || 0) + 1,
      start_time: Date.now(),
      location: {
        // Default to a central location, or use user's last known location
        name: "",
        address: "",
        latitude: 37.78825,
        longitude: -122.4324,
      },
      title: "",
      description: "",
    };
    setEvent({ ...event, itinerary: [...(event.itinerary ?? []), newItem] });
  };

  const handleRemoveItem = (idx: number) => {
    const updated = (event.itinerary ?? []).filter((_, i) => i !== idx);
    setEvent({ ...event, itinerary: updated });
  };

  const handleUpdateItem = (
    idx: number,
    updatedFields: Partial<ItineraryItem>
  ) => {
    const updated = [...(event.itinerary ?? [])];
    updated[idx] = { ...updated[idx], ...updatedFields };
    setEvent({ ...event, itinerary: updated });
  };

  return (
    <View>
      <Text style={styles.label}>Itinerary</Text>
      {(event.itinerary ?? []).map((item, idx) => (
        <View
          key={idx}
          style={[
            styles.itineraryItem,
            { zIndex: (event.itinerary?.length || 0) - idx },
          ]}
        >
          <Text style={styles.itineraryTitle}>Stop {idx + 1}</Text>
          {/* Title */}
          <Text style={styles.fieldLabel}>Title</Text>
          <TextInput
            style={styles.input}
            value={item.title}
            onChangeText={(text) => handleUpdateItem(idx, { title: text })}
            placeholder="e.g., Coffee & Pastries"
          />

          {/* Start Time Picker */}
          <Text style={styles.fieldLabel}>Start Time:</Text>
          <TouchableOpacity onPress={() => setShowTimePickerIdx(idx)}>
            <Text style={styles.timeText}>
              {new Date(item.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>

          {/* Location Picker */}
          <LocationPicker
            renderKey={`${idx}-${item.start_time}`}
            initialLocation={item.location}
            onLocationChange={(location) => {
              handleUpdateItem(idx, { location });
            }}
          />

          {/* Description */}
          <Text style={styles.fieldLabel}>Description:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={item.description}
            onChangeText={(text) =>
              handleUpdateItem(idx, { description: text })
            }
            placeholder="What happens at this stop?"
            multiline
          />

          <TouchableOpacity
            style={styles.removeBtnContainer}
            onPress={() => handleRemoveItem(idx)}
          >
            <Text style={styles.removeBtnText}>Remove Stop</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addBtnContainer} onPress={handleAddItem}>
        <Text style={styles.addBtnText}>+ Add Itinerary Stop</Text>
      </TouchableOpacity>

      {showTimePickerIdx !== null && (
        <CustomTimePicker
          isVisible={showTimePickerIdx !== null}
          onClose={() => setShowTimePickerIdx(null)}
          value={
            new Date(
              (event.itinerary ?? [])[showTimePickerIdx]?.start_time ||
                Date.now()
            )
          }
          onChange={(newDate) => {
            const itineraryItem = (event.itinerary ?? [])[showTimePickerIdx];
            if (itineraryItem) {
              handleUpdateItem(showTimePickerIdx, {
                start_time: newDate.getTime(),
              });
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  itineraryItem: {
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  itineraryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
  },
  timeText: {
    color: "#007AFF",
    marginVertical: 8,
    fontWeight: "bold",
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
  },
  addBtnContainer: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 15,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  removeBtnContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
    alignItems: "center",
  },
  removeBtnText: {
    color: "#FF3B30",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default EventItineraryForm;
