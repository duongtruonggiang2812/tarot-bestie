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
        // Check if user already exists
        const { data: existing } = await admin
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existing) {
          // New user — tặng 10 xu chào mừng
          await admin.from("users").insert({
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.image,
            coins: 10,
          });
        } else {
          // Existing user — chỉ update profile, không đụng coins
          await admin.from("users").update({
            email: user.email,
            name: user.name,
            avatar: user.image,
          }).eq("id", user.id);
        }
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
