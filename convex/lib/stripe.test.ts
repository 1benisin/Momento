/**
 * Test utilities for Stripe integration
 * Provides mock objects and functions for testing Stripe functionality
 */

export const mockStripe = {
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn(),
  },
  customers: {
    create: jest.fn(),
  },
  identity: {
    verificationSessions: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  },
  webhooks: {
    constructEvent: jest.fn(),
  },
  refunds: {
    create: jest.fn(),
  },
};

export const mockPaymentIntent = {
  id: "pi_12345",
  client_secret: "pi_12345_secret",
  status: "succeeded",
  amount: 500,
  currency: "usd",
  customer: "cus_12345",
  metadata: {
    eventId: "evt_12345",
    userId: "user_12345",
  },
};

export const mockCustomer = {
  id: "cus_12345",
  email: "test@example.com",
  name: "Test User",
};

export const mockVerificationSession = {
  id: "vs_12345",
  client_secret: "vs_12345_secret",
  status: "verified",
  url: "https://stripe.com/verify/vs_12345",
  verified_outputs: {
    address: {
      city: "San Francisco",
      country: "US",
      line1: "123 Main St",
      postal_code: "94105",
      state: "CA",
    },
    dob: {
      day: 1,
      month: 1,
      year: 1990,
    },
    first_name: "Test",
    last_name: "User",
  },
  last_error: null,
};

export const setupStripeMocks = () => {
  mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);
  mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);
  mockStripe.customers.create.mockResolvedValue(mockCustomer);
  mockStripe.identity.verificationSessions.create.mockResolvedValue(
    mockVerificationSession
  );
  mockStripe.identity.verificationSessions.retrieve.mockResolvedValue(
    mockVerificationSession
  );
};
