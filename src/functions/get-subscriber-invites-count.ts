import { redis } from '../database/redis'

interface getSubscriberInvitesCountParams {
  subscriberId: string
}

export async function getSubscriberInvitesCount({
  subscriberId,
}: getSubscriberInvitesCountParams) {
  const count = await redis.zscore('referral:ranking', subscriberId)

  return { count: count ? Number.parseInt(count) : 0 }
}
