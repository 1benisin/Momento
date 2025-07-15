import React, { useState, useMemo } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { devLog } from "@/utils/devLog";
import CustomTimePicker from "./CustomTimePicker";

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
  const [showTimePickerIdx, setShowTimePickerIdx] = useState<number | null>(
    null
  );
  const [manualLocationIdx, setManualLocationIdx] = useState<number | null>(
    null
  );

  devLog("Rendering EventItineraryForm, showTimePickerIdx:", showTimePickerIdx);

  const pickerDate = useMemo(() => {
    if (showTimePickerIdx === null) {
      return new Date(); // Default value, not used when picker is hidden
    }
    const item = (event.itinerary ?? [])[showTimePickerIdx];
    return new Date(item?.start_time || Date.now());
  }, [showTimePickerIdx, event.itinerary]);

  const handleAddItem = () => {
    const newItem = {
      start_time: Date.now(),
      location: {
        name: "",
        latitude: 0,
        longitude: 0,
      },
      description: "",
    };
    setEvent({ ...event, itinerary: [...(event.itinerary ?? []), newItem] });
  };

  const handleRemoveItem = (idx: number) => {
    const updated = (event.itinerary ?? []).filter((_, i) => i !== idx);
    setEvent({ ...event, itinerary: updated });
  };

  const handleUpdateItem = (idx: number, updatedItem: any) => {
    const updated = [...(event.itinerary ?? [])];
    updated[idx] = updatedItem;
    setEvent({ ...event, itinerary: updated });
  };

  return (
    <View>
      <Text style={styles.label}>Itinerary</Text>
      {(event.itinerary ?? []).map((item, idx) => (
        <View key={idx} style={styles.itineraryItem}>
          {/* Start Time Picker */}
          <Text>Start Time:</Text>
          <TouchableOpacity onPress={() => setShowTimePickerIdx(idx)}>
            <Text style={styles.timeText}>
              {new Date(item.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>

          {/* Location Picker (scaffold) */}
          <Text>Location:</Text>
          <TextInput
            style={styles.input}
            value={item.location.name}
            onChangeText={(text) =>
              handleUpdateItem(idx, {
                ...item,
                location: { ...item.location, name: text },
              })
            }
            placeholder="Location name"
          />
          <TextInput
            style={styles.input}
            value={item.location.address || ""}
            onChangeText={(text) =>
              handleUpdateItem(idx, {
                ...item,
                location: { ...item.location, address: text },
              })
            }
            placeholder="Address (optional)"
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              value={item.location.latitude?.toString() || ""}
              onChangeText={(text) =>
                handleUpdateItem(idx, {
                  ...item,
                  location: {
                    ...item.location,
                    latitude: parseFloat(text) || 0,
                  },
                })
              }
              placeholder="Latitude"
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 5 }]}
              value={item.location.longitude?.toString() || ""}
              onChangeText={(text) =>
                handleUpdateItem(idx, {
                  ...item,
                  location: {
                    ...item.location,
                    longitude: parseFloat(text) || 0,
                  },
                })
              }
              placeholder="Longitude"
              keyboardType="numeric"
            />
          </View>
          {/* Optionally: Add a button to open a map picker modal here */}
          <Text style={styles.mapBtn} onPress={() => setManualLocationIdx(idx)}>
            Pick on Map (not implemented)
          </Text>

          {/* Description */}
          <Text>Description:</Text>
          <TextInput
            style={styles.input}
            value={item.description}
            onChangeText={(text) =>
              handleUpdateItem(idx, { ...item, description: text })
            }
            placeholder="What happens at this stop?"
          />

          <Text style={styles.removeBtn} onPress={() => handleRemoveItem(idx)}>
            Remove
          </Text>
        </View>
      ))}
      <Text style={styles.addBtn} onPress={handleAddItem}>
        + Add Itinerary Item
      </Text>

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
                ...itineraryItem,
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
  timeText: {
    color: "#007AFF",
    marginVertical: 5,
    fontWeight: "bold",
  },
  addBtn: {
    color: "#007AFF",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  removeBtn: {
    color: "#FF3B30",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 14,
  },
  mapBtn: {
    color: "#007AFF",
    marginTop: 5,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default EventItineraryForm;
