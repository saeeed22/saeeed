import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const ALLOWED_GITHUB_LOGIN = "saeeed22";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ profile }) {
      const login = (profile as { login?: string } | undefined)?.login;
      return login === ALLOWED_GITHUB_LOGIN;
    },
    async jwt({ token, profile }) {
      if (profile && "login" in profile) {
        token.login = (profile as { login?: string }).login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.login) {
        (session.user as { login?: string }).login = token.login as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});
