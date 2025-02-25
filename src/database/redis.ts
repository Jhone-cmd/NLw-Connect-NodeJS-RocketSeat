import { Redis } from 'ioredis'
import { env } from '../env/schema'

export const redis = new Redis(env.REDIS_URL)
