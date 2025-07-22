import {vi} from 'vitest'
// Mock Stripe for testing
export const stripe = {
  identity: {
    verificationSessions: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
  },
  customers: {
    create: vi.fn(),
  },
  paymentIntents: {
    create: vi.fn(),
    retrieve: vi.fn(),
  },
  refunds: {
    create: vi.fn(),
  },
}

export const mockVerificationSession = {
  id: 'vs_test_12345',
  client_secret: 'vcs_test_secret_12345',
  status: 'requires_input',
}

export const mockPaymentIntent = {
  id: 'pi_test_12345',
  client_secret: 'pi_test_secret_12345',
  status: 'requires_payment_method',
  amount: 500,
}

export const mockCustomer = {
  id: 'cus_test_12345',
  email: 'test@example.com',
}

export const setupStripeMocks = () => {
  stripe.identity.verificationSessions.create.mockResolvedValue(
    mockVerificationSession,
  )
  stripe.identity.verificationSessions.retrieve.mockResolvedValue(
    mockVerificationSession,
  )
  stripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent)
  stripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent)
  stripe.customers.create.mockResolvedValue(mockCustomer)
}

export default stripe
