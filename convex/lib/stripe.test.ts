// Mock Stripe for testing
export const mockStripe = {
  identity: {
    verificationSessions: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  },
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn(),
  },
  customers: {
    create: jest.fn(),
  },
};

export const mockVerificationSession = {
  id: "vs_test_12345",
  client_secret: "vcs_test_secret_12345",
  status: "requires_input",
};

export const mockPaymentIntent = {
  id: "pi_test_12345",
  client_secret: "pi_test_secret_12345",
  status: "requires_payment_method",
  amount: 500,
};

export const mockCustomer = {
  id: "cus_test_12345",
  email: "test@example.com",
};

export const setupStripeMocks = () => {
  mockStripe.identity.verificationSessions.create.mockResolvedValue(
    mockVerificationSession,
  );
  mockStripe.identity.verificationSessions.retrieve.mockResolvedValue(
    mockVerificationSession,
  );
  mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);
  mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);
  mockStripe.customers.create.mockResolvedValue(mockCustomer);
};

export default mockStripe;
