import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").readonly(),
  APP_PORT: z.coerce.number().min(1, "APP_PORT is required and must be a number greater than 0").readonly(),
  PINO_LOG_LEVEL: z.string().min(1, "PINO_LOG_LEVEL is required").readonly(),
  NODE_ENV: z.string().min(1, "NODE_ENV is required").readonly(),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required").readonly(),
  INITIAL_SETUP_DONE: z
    .string()
    .min(1, "INITIAL_SETUP_DONE is required")
    .transform((value) => value === "true")
    .readonly(),
  NOTIFICATION_SERVICE_BASE_URL: z.string().url().readonly(),
  USER_SERVICE_BASE_URL: z.string().url().readonly(),
  CLIENT_URL: z.string().url().readonly(),
});

export const envConstants = envSchema.parse(process.env);
