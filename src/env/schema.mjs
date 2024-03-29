// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL:
    process.env.NODE_ENV === "test"
      ? z.string().url().optional()
      : z.string().url(),
  SHADOW_DATABASE_URL:
    process.env.NODE_ENV === "development"
      ? z.string().url()
      : z.string().url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL:
    process.env.NODE_ENV === "test"
      ? z.string().optional()
      : z.preprocess(
          // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
          // Since NextAuth automatically uses the VERCEL_URL if present.
          (str) => process.env.VERCEL_URL ?? str,
          // VERCEL_URL doesnt include `https` so it cant be validated as a URL
          process.env.VERCEL ? z.string() : z.string().url()
        ),
  GOOGLE_CLIENT_ID:
    process.env.NODE_ENV === "test" ? z.string().optional() : z.string(),
  GOOGLE_CLIENT_SECRET:
    process.env.NODE_ENV === "test" ? z.string().optional() : z.string(),

  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  UPSTASH_REDIS_REST_URL:
    process.env.NODE_ENV === "test"
      ? z.string().url().optional()
      : z.string().url(),
  UPSTASH_REDIS_REST_TOKEN:
    process.env.NODE_ENV === "test" ? z.string().optional() : z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_BAR: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
};
