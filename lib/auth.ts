import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { authenticate, findUserByEmail } from "./db";
import type { Role } from "./types";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;
      const user = await authenticate(parsed.data.email, parsed.data.password);
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.avatar,
        role: user.role,
        username: user.username,
      };
    },
  }),
];

if (googleEnabled) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // A deterministic fallback keeps local previews working without env vars.
  // Always set NEXTAUTH_SECRET in production (see .env.example).
  secret:
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "aaron-works-development-secret-change-in-production",
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role ?? "client";
        token.username =
          (user as { username?: string }).username ??
          (user.email ? user.email.split("@")[0] : "member");
        token.picture = user.image ?? token.picture;
        token.name = user.name ?? token.name;
      }

      // Google sign-ins arrive without app roles — resolve them from the store.
      if (!token.role && token.email) {
        const existing = await findUserByEmail(token.email);
        token.id = existing?.id ?? token.sub;
        token.role = existing?.role ?? "client";
        token.username =
          existing?.username ?? token.email.split("@")[0] ?? "member";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.role = (token.role as Role) ?? "client";
        session.user.username = (token.username as string) ?? "";
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
});

export async function requireSession() {
  const session = await auth();
  return session?.user ?? null;
}
