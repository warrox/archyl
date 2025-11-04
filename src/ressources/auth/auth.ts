import { betterAuth } from "better-auth";
import { pool } from '../../../db/db'
import * as dotenv from "dotenv"

dotenv.config({ path: '.env' })

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
