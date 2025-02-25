import type { Config } from 'drizzle-kit'
import { env } from './src/env/schema'

export default {
  schema: './src/database/drizzle/schemas/*',
  out: './src/database/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.POSTGRESQL_URL,
  },
} satisfies Config
