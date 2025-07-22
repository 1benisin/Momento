import {convexTest} from 'convex-test'
import {expect, test, describe} from 'vitest'
import {api} from '../_generated/api'
import schema from '../schema'

describe('User', () => {
  describe('getOrCreateUser', () => {
    test('should create a new user if one does not exist', async () => {
      const t = convexTest(schema as any)
      const asUser = t.withIdentity({
        email: 'test@example.com',
        tokenIdentifier: 'test_token_identifier',
      })

      const userId = await asUser.mutation(api.user.getOrCreateUser, {})
      expect(userId).not.toBeNull()

      const user = await asUser.query(api.user.me)
      expect(user).not.toBeNull()
      if (user) {
        expect(user.email).toBe('test@example.com')
      }
    })

    test('should return existing user if one exists', async () => {
      const t = convexTest(schema as any)
      const clerkId = 'clerk_123'
      const tokenIdentifier = `https|clerk_123`
      await t.run(async ctx => {
        await ctx.db.insert('users', {
          tokenIdentifier,
          clerkId,
          email: 'existing@example.com',
          accountStatus: 'active',
        })
      })

      const asUser = t.withIdentity({
        email: 'existing@example.com',
        tokenIdentifier,
        subject: clerkId,
      })

      const userId = await asUser.mutation(api.user.getOrCreateUser, {})
      const user = await asUser.query(api.user.me)

      expect(user).not.toBeNull()
      if (user) {
        expect(user.email).toBe('existing@example.com')
        const queriedUser = await t.run(async ctx => ctx.db.get(userId))
        expect(queriedUser?._id).toEqual(user._id)
      }
    })
  })
})
