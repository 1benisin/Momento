/**
 * Payment Sheet component for Stripe payments
 * Handles payment processing using Stripe's Payment Sheet
 */

import React, { useEffect, useState } from "react";
import { View, Text, Alert, ActivityIndicator, Button } from "react-native";
import { usePaymentSheet } from "@stripe/stripe-react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { devLog } from "@/utils/devLog";
import { StripeProvider } from "./StripeProvider";

interface PaymentSheetProps {
  eventId: string;
  amount: number; // Amount in cents
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

export const PaymentSheetComponent: React.FC<PaymentSheetProps> = ({
  eventId,
  amount,
  currency,
  onSuccess,
  onCancel,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [isSheetInitialized, setIsSheetInitialized] = useState(false);

  const createPayment = useMutation(
    api.payments.createEventConfirmationPayment
  );

  const {
    initPaymentSheet,
    presentPaymentSheet,
    loading: paymentSheetLoading,
  } = usePaymentSheet();

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      devLog("[PaymentSheet] Initializing payment", {
        eventId,
        amount,
        currency,
      });

      // Create payment intent on the backend
      const { clientSecret } = await createPayment({
        eventId: eventId as any, // Type assertion for Convex ID
        amount,
        currency,
      });

      if (!clientSecret) {
        throw new Error("Failed to create payment intent.");
      }

      // Initialize the payment sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Momento",
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          name: "Momento Event Confirmation",
        },
      });

      if (error) {
        devLog("[PaymentSheet] Payment sheet initialization error", error);
        onError(`Payment initialization failed: ${error.message}`);
        setIsSheetInitialized(false);
        return;
      }

      devLog("[PaymentSheet] Payment sheet initialized successfully");
      setIsSheetInitialized(true);
    } catch (error: any) {
      devLog("[PaymentSheet] Error initializing payment", error);
      onError(`Payment initialization failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error: ${error.code}`, error.message);
      onError(error.message);
    } else {
      Alert.alert("Success", "Your payment was successful!");
      onSuccess();
    }
  };

  if (loading || paymentSheetLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, color: "gray" }}>
          Setting up payment...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
        Event Confirmation Fee
      </Text>
      <Text style={{ marginBottom: 16 }}>
        Amount: ${(amount / 100).toFixed(2)} {currency.toUpperCase()}
      </Text>
      <Text style={{ marginBottom: 24, color: "gray" }}>
        This non-refundable fee confirms your event and helps cover platform
        costs.
      </Text>
      <Button
        disabled={!isSheetInitialized}
        title="Pay Now"
        onPress={openPaymentSheet}
      />
    </View>
  );
};

/**
 * Wrapper component that provides Stripe context
 */
export const PaymentSheetWrapper: React.FC<PaymentSheetProps> = (props) => {
  return (
    <StripeProvider>
      <PaymentSheetComponent {...props} />
    </StripeProvider>
  );
};
