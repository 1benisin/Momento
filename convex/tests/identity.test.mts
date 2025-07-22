import {convexTest} from 'convex-test'
import {vi} from 'vitest'
import {api} from '../_generated/api'
import * as stripe from '../lib/stripe'
import schema from '../schema'

vi.mock('../lib/stripe', async () => {
  return {
    createVerificationSession: vi.fn(),
    getVerificationSession: vi.fn(),
  }
})

vi.mock('./user', async () => {
  const original = await vi.importActual('./user')
  return {
    ...original,
    updateVerificationStatus: vi.fn(),
  }
})

describe('Identity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createHostVerificationSession', () => {
    test('should create a verification session', async () => {
      const t = convexTest(schema as any)
      await t.run(async ctx => {
        await ctx.db.insert('users', {
          tokenIdentifier: 'token_identifier_1',
          clerkId: 'clerk_123',
          email: 'test@example.com',
          accountStatus: 'active',
          hostProfile: {
            host_type: 'user',
            host_name: 'Test Host',
            host_bio: 'Bio',
          },
        })
      })

      const asUser = t.withIdentity({
        tokenIdentifier: 'token_identifier_1',
        email: 'test@example.com',
      })

      const session = {
        id: 'vs_123',
        status: 'verified',
        clientSecret: 'secret',
        url: 'https://example.com',
      }
      ;(stripe.createVerificationSession as any).mockResolvedValue(session)

      const result = await asUser.mutation(
        api.identity.createHostVerificationSession,
        {returnUrl: 'https://example.com/return', type: 'document'},
      )

      expect(stripe.createVerificationSession).toHaveBeenCalled()
      expect(result.sessionId).toBe(session.id)
      expect(result.clientSecret).toBe(session.clientSecret)
      expect(result.status).toBe(session.status)
    })
  })

  describe('getVerificationSessionDetails', () => {
    test('should return verification session details', async () => {
      const t = convexTest(schema as any)
      const asUser = t.withIdentity({
        tokenIdentifier: 'token_identifier_1',
        email: 'test@example.com',
      })
      const session = {
        id: 'vs_123',
        status: 'verified',
        client_secret: 'secret',
        url: 'https://example.com',
        last_error: null,
        verified_outputs: null,
      }
      ;(stripe.getVerificationSession as any).mockResolvedValue(session)

      const result = await asUser.query(
        api.identity.getVerificationSessionDetails,
        {
          sessionId: 'vs_123',
        },
      )

      expect(stripe.getVerificationSession).toHaveBeenCalledWith('vs_123')
      expect(result.id).toBe(session.id)
      expect(result.status).toBe(session.status)
    })
  })

  describe('updateUserVerificationStatus', () => {
    test('should update user verification status', async () => {
      const t = convexTest(schema as any)
      const asUser = t.withIdentity({
        tokenIdentifier: 'token_identifier_1',
        email: 'test@example.com',
        subject: 'clerk_123',
      })
      await t.run(async ctx => {
        await ctx.db.insert('users', {
          email: 'test@example.com',
          clerkId: 'clerk_123',
          tokenIdentifier: 'token_identifier_1',
          accountStatus: 'active',
          hostProfile: {
            host_type: 'user',
            host_name: 'Test Host',
            host_bio: 'Bio',
          },
        })
      })

      await asUser.mutation(api.identity.updateUserVerificationStatus, {
        isVerified: true,
        sessionId: 'vs_123',
      })

      const user = await t.run(async ctx => {
        return await ctx.db
          .query('users')
          .filter(q => q.eq(q.field('clerkId'), 'clerk_123'))
          .unique()
      })
      expect(user?.hostProfile?.is_verified).toBe(true)
    })
  })

  describe('isUserVerifiedForHosting', () => {
    test('should return true if user is verified', async () => {
      const t = convexTest(schema as any)
      await t.run(async ctx => {
        await ctx.db.insert('users', {
          email: 'test@example.com',
          clerkId: 'clerk_123',
          tokenIdentifier: 'token_identifier_1',
          accountStatus: 'active',
          hostProfile: {
            host_type: 'user',
            host_name: 'Test Host',
            host_bio: 'Bio',
            is_verified: true,
          },
        })
      })

      const asUser = t.withIdentity({
        tokenIdentifier: 'token_identifier_1',
        email: 'test@example.com',
      })

      const result = await asUser.query(api.identity.isUserVerifiedForHosting)
      expect(result.isVerified).toBe(true)
    })

    test('should return false if user is not verified', async () => {
      const t = convexTest(schema as any)
      await t.run(async ctx => {
        await ctx.db.insert('users', {
          email: 'test@example.com',
          clerkId: 'clerk_123',
          tokenIdentifier: 'token_identifier_1',
          accountStatus: 'active',
          hostProfile: {
            host_type: 'user',
            host_name: 'Test Host',
            host_bio: 'Bio',
            is_verified: false,
          },
        })
      })

      const asUser = t.withIdentity({
        tokenIdentifier: 'token_identifier_1',
        email: 'test@example.com',
      })

      const result = await asUser.query(api.identity.isUserVerifiedForHosting)
      expect(result.isVerified).toBe(false)
    })
  })
})
