import { serverScheme } from "./schema";
import type { ZodFormattedError } from "zod";

export const formatErrors = (
  errors: ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

const env = serverScheme.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  ENABLE_VC_BUILD: process.env.ENABLE_VC_BUILD,
  DATABASE_URL: process.env.DATABASE_URL,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  SESSION_SECRET: process.env.SESSION_SECRET,
});

if (env.success === false) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(env.error.format())
  );
  throw new Error("Invalid environment variables");
}

export const serverEnv = env.data;
