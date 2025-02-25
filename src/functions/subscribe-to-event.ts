import { subscriptions } from '../database/drizzle/schemas/subscriptions'
import { db } from '../database/postgres'

interface SubscribeToEventParams {
  name: string
  email: string
}

export async function subscribeToEvent({
  name,
  email,
}: SubscribeToEventParams) {
  const result = await db
    .insert(subscriptions)
    .values({
      name,
      email,
    })
    .returning()

  const subscribe = result[0]

  return {
    subscriberId: subscribe.id,
  }
}
