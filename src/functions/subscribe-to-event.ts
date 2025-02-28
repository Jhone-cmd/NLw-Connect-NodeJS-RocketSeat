import { eq } from 'drizzle-orm'
import { subscriptions } from '../database/drizzle/schemas/subscriptions'
import { db } from '../database/postgres'
import { redis } from '../database/redis'

interface SubscribeToEventParams {
  name: string
  email: string
  referrerId?: string | null
}

export async function subscribeToEvent({
  name,
  email,
  referrerId,
}: SubscribeToEventParams) {
  const subscriber = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email))

  if (subscriber.length > 0) {
    return { subscriberId: subscriber[0].id }
  }

  const result = await db
    .insert(subscriptions)
    .values({
      name,
      email,
    })
    .returning()

  if (referrerId) {
    await redis.zincrby('referral:ranking', 1, referrerId)
  }

  const subscribe = result[0]

  return {
    subscriberId: subscribe.id,
  }
}
