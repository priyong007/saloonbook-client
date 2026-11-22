import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db, mongoClient as client } from "@/lib/db";

export const auth = betterAuth({

    
    emailAndPassword: {
        enabled: true,
        // Match the sign-up form's rule (better-auth defaults to 8).
        minPasswordLength: 6,
    },

        user: {
        additionalFields: {
            role: {
                type: ["customer", "admin"],
                required: false,
                input: true,
                defaultValue: "customer",
            },
        },
    },

     socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
      },

  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
});