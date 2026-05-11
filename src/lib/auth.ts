import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const ALLOWED_GITHUB_LOGIN = "saeeed22";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [GitHub],
  callbacks: {
    async signIn({ profile }) {
      const login = (profile as { login?: string } | undefined)?.login;
      return login === ALLOWED_GITHUB_LOGIN;
    },
    async jwt({ token, profile, account }) {
      if (account && profile) {
        const p = profile as { login?: string; name?: string; email?: string; avatar_url?: string };
        token.login = p.login;
        token.name = p.name ?? token.name;
        token.email = p.email ?? token.email;
        token.picture = p.avatar_url ?? token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: (token.name as string) ?? null,
        email: (token.email as string) ?? "",
        image: (token.picture as string) ?? null,
      };
      (session.user as { login?: string }).login = (token.login as string) ?? undefined;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});
