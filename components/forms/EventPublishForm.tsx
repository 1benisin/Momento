import React from "react";
import { StyleSheet, Button, Alert } from "react-native";
import { Text, View } from "@/components/Themed";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "expo-router";
import { FrontendEvent } from "./EventItineraryForm";

interface EventPublishFormProps {
  event: FrontendEvent;
}

const EventPublishForm: React.FC<EventPublishFormProps> = ({ event }) => {
  const router = useRouter();
  const createOrUpdateDraft = useMutation(api.events.createOrUpdateDraft);
  const publishEvent = useMutation(api.events.publishEvent);

  const handleSaveDraft = async () => {
    try {
      await createOrUpdateDraft({
        ...event,
        title: event.title ?? "",
        description: event.description ?? "",
        min_attendees: event.min_attendees ?? 4,
        max_attendees: event.max_attendees ?? 4,
        estimated_event_cost: event.estimated_event_cost ?? [],
        itinerary: event.itinerary ?? [],
      });
      Alert.alert("Success", "Draft saved successfully!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save draft.");
    }
  };

  const handlePublish = async () => {
    if (!event._id) {
      Alert.alert("Error", "You must save a draft before publishing.");
      return;
    }
    try {
      await publishEvent({ id: event._id });
      Alert.alert("Success", "Event published successfully!");
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Could not publish event.");
      // TODO: Display VerificationPromptBanner if error is due to verification
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>Review your event details below.</Text>
      {/* Add a summary of the event details here */}
      <View style={styles.buttonContainer}>
        <Button title="Save Draft" onPress={handleSaveDraft} />
        <Button title="Publish" onPress={handlePublish} color="#841584" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  summaryText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
});

export default EventPublishForm;
