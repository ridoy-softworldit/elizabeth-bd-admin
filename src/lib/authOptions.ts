import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        if (!res.ok) return null;
        const json = await res.json();
        if (!json?.data) return null;

        return {
          id: json.data._id,
          name: json.data.name,
          email: json.data.email,
          role: json.data.role,
          gender: json.data.gender,
          walletPoint: json.data.walletPoint,
          accessToken: json.data.accessToken,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                provider: "google",
              }),
            }
          );
          const json = await res.json();

          if (res.ok && json.success) {
            user.id = json.data._id;
            user.role = json.data.role;
            user.gender = json.data.gender;
            user.walletPoint = json.data.walletPoint;
            return true;
          }
        } catch (error) {
          console.error(error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.gender = user.gender;
        token.walletPoint = user.walletPoint;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.accessToken) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/auth/me`,
            {
              headers: { Authorization: `Bearer ${token.accessToken}` },
            }
          );
          if (res.ok) {
            const json = await res.json();
            session.user.role = json.data.role;
            session.user.walletPoint = json.data.walletPoint;
          }
        } catch (error) {
          console.error("Failed to fetch fresh user data:", error);
        }
        session.user.id = token.id;
        session.user.gender = token.gender;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
