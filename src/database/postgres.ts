import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env/schema'
import { subscriptions } from './drizzle/schemas/subscriptions'

export const pg = postgres(env.POSTGRESQL_URL)
export const db = drizzle(pg, {
  schema: {
    subscriptions,
  },
})
