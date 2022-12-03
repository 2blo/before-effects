import NextAuth, { type NextAuthOptions } from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import DiscordProvider from "next-auth/providers/discord";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";


import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined || process.env.SUPABASE_SERVICE_ROLE_KEY === undefined) {
  throw Error("NextAuth Supabase url or key not set.")
}


export default NextAuth(authOptions);
