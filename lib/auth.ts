import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getSupabaseAdmin } from "./supabase";

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const isGoogleConfigured =
  googleClientId !== "" &&
  googleClientId !== "your_google_client_id" &&
  googleClientSecret !== "" &&
  googleClientSecret !== "your_google_client_secret";

export const authOptions: NextAuthOptions = {
  providers: isGoogleConfigured
    ? [
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      ]
    : [],
  callbacks: {
    async signIn({ user }) {
      const admin = getSupabaseAdmin();
      if (admin && user.id && user.email) {
        await admin.from("users").upsert(
          { id: user.id, email: user.email, name: user.name, avatar: user.image },
          { onConflict: "id", ignoreDuplicates: true }
        );
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub!;
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET ?? "tarot-bestie-dev-secret",
};
