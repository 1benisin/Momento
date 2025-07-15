import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";
import { FrontendEvent } from "./EventItineraryForm";

interface EventDetailsFormProps {
  event: FrontendEvent;
  setEvent: (event: FrontendEvent) => void;
}

const EventDetailsForm: React.FC<EventDetailsFormProps> = ({
  event,
  setEvent,
}) => {
  return (
    <View>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={event.title}
        onChangeText={(title) => setEvent({ ...event, title })}
        placeholder="e.g., Sunset Hike and Picnic"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={event.description}
        onChangeText={(description) => setEvent({ ...event, description })}
        placeholder="Describe the event..."
        multiline
      />

      <Text style={styles.label}>Min. Attendees</Text>
      <TextInput
        style={styles.input}
        value={
          event.min_attendees && event.min_attendees >= 4
            ? event.min_attendees.toString()
            : "4"
        }
        onChangeText={(text) => {
          const value = Math.max(4, parseInt(text) || 0);
          setEvent({ ...event, min_attendees: value });
        }}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Max. Attendees</Text>
      <TextInput
        style={styles.input}
        value={event.max_attendees?.toString()}
        onChangeText={(text) =>
          setEvent({ ...event, max_attendees: parseInt(text) || 0 })
        }
        keyboardType="numeric"
      />

      {/* Estimated Event Cost: Array of { amount, description } */}
      <Text style={styles.label}>Estimated Event Costs</Text>
      {(event.estimated_event_cost ?? []).length > 0 ? (
        (event.estimated_event_cost ?? []).map((item, idx) => (
          <View key={idx} style={styles.costItemRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              value={item.amount?.toString() || ""}
              onChangeText={(text) => {
                const updated = [...(event.estimated_event_cost ?? [])];
                updated[idx] = {
                  ...updated[idx],
                  amount: parseFloat(text) || 0,
                };
                setEvent({ ...event, estimated_event_cost: updated });
              }}
              keyboardType="numeric"
              placeholder="$ Amount"
            />
            <TextInput
              style={[styles.input, { flex: 2, marginRight: 5 }]}
              value={item.description || ""}
              onChangeText={(text) => {
                const updated = [...(event.estimated_event_cost ?? [])];
                updated[idx] = { ...updated[idx], description: text };
                setEvent({ ...event, estimated_event_cost: updated });
              }}
              placeholder="Description"
            />
            <Text
              style={styles.removeBtn}
              onPress={() => {
                const updated = (event.estimated_event_cost ?? []).filter(
                  (_, i) => i !== idx
                );
                setEvent({ ...event, estimated_event_cost: updated });
              }}
            >
              Remove
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: "#888", marginBottom: 5 }}>
          No cost items added.
        </Text>
      )}
      <Text
        style={styles.addBtn}
        onPress={() => {
          const updated = Array.isArray(event.estimated_event_cost)
            ? [...event.estimated_event_cost]
            : [];
          updated.push({ amount: 0, description: "" });
          setEvent({ ...event, estimated_event_cost: updated });
        }}
      >
        + Add Cost Item
      </Text>
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  costItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  addBtn: {
    color: "#007AFF",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  removeBtn: {
    color: "#FF3B30",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default EventDetailsForm;
