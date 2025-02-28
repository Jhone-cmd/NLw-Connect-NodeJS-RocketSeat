import { inArray } from 'drizzle-orm'
import { subscriptions } from '../database/drizzle/schemas/subscriptions'
import { db } from '../database/postgres'
import { redis } from '../database/redis'

export async function getRanking() {
  const ranking = await redis.zrevrange('referral:ranking', 0, 2, 'WITHSCORES')
  const subscriberWithScore: Record<string, number> = {}

  for (let i = 0; i < ranking.length; i += 2) {
    subscriberWithScore[ranking[i]] = Number.parseInt(ranking[i + 1])
  }

  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(inArray(subscriptions.id, Object.keys(subscriberWithScore)))

  const rankingWithScore = subscribers
    .map(subscriber => {
      return {
        id: subscriber.id,
        name: subscriber.name,
        score: subscriberWithScore[subscriber.id],
      }
    })
    .sort((sub1, sub2) => {
      return sub2.score - sub1.score
    })

  return { rankingWithScore }
}
