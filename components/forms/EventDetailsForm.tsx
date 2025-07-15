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
        value={event.min_attendees?.toString()}
        onChangeText={(text) =>
          setEvent({ ...event, min_attendees: parseInt(text) || 0 })
        }
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

      <Text style={styles.label}>Confirmation Fee (in cents)</Text>
      <TextInput
        style={styles.input}
        value={event.confirmation_fee?.toString()}
        onChangeText={(text) =>
          setEvent({ ...event, confirmation_fee: parseInt(text) || 0 })
        }
        keyboardType="numeric"
        placeholder="e.g., 500 for $5.00"
      />

      {/* A proper input for estimated_event_cost (JSON) would be more complex.
          For now, we'll use a simple text input for a description of the cost. */}
      <Text style={styles.label}>Estimated Event Cost</Text>
      <TextInput
        style={styles.input}
        value={
          typeof event.estimated_event_cost === "string"
            ? event.estimated_event_cost
            : ""
        }
        onChangeText={(text) =>
          setEvent({ ...event, estimated_event_cost: text })
        }
        placeholder="e.g., Approx. $20 for food and drinks"
      />
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
});

export default EventDetailsForm;
