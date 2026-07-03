import { z } from 'zod'

const configSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  JWT_SECRET: z
    .string()
    .min(8, 'JWT_SECRET must be at least 8 characters long'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
})

// Parse process.env
const result = configSchema.safeParse(process.env)

if (!result.success) {
  console.error('❌ Invalid environment variables configuration:')
  console.error(JSON.stringify(result.error.format(), null, 2))
  process.exit(1)
}

export const env = result.data
export default env
