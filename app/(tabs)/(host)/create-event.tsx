import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, Button } from "react-native";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import EventDetailsForm from "@/components/forms/EventDetailsForm";
import EventItineraryForm, {
  FrontendEvent,
} from "@/components/forms/EventItineraryForm";
import EventPublishForm from "@/components/forms/EventPublishForm";

const CreateEventScreen = () => {
  const { eventId } = useLocalSearchParams();
  const eventToEdit = useQuery(
    api.events.getEvent,
    eventId ? { id: eventId as Id<"events"> } : "skip"
  );

  const [step, setStep] = useState(1);
  const [event, setEvent] = useState<FrontendEvent>({
    title: "",
    description: "",
    min_attendees: 2,
    max_attendees: 10,
    confirmation_fee: 500, // Default to $5.00 in cents
    estimated_event_cost: {},
    itinerary: [],
  });

  useEffect(() => {
    if (eventToEdit) {
      setEvent(eventToEdit as FrontendEvent);
    }
  }, [eventToEdit]);

  if (eventId && eventToEdit === undefined) {
    return <ActivityIndicator style={styles.centered} />;
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <EventDetailsForm event={event} setEvent={setEvent} />;
      case 2:
        return <EventItineraryForm event={event} setEvent={setEvent} />;
      case 3:
        return <EventPublishForm event={event} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {eventId ? "Edit Event" : "Create Event"} - Step {step} of 3
      </Text>
      {renderStep()}
      <View style={styles.navigation}>
        {step > 1 && (
          <Button title="Previous" onPress={() => setStep(step - 1)} />
        )}
        {step < 3 && <Button title="Next" onPress={() => setStep(step + 1)} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default CreateEventScreen;
