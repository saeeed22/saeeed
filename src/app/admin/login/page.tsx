import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GithubIcon } from "@/components/brand-icons";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-coral mb-3">Admin</p>
        <h1 className="font-display text-3xl tracking-[-0.02em] mb-2">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Only the site owner can access this dashboard.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            <GithubIcon className="h-4 w-4" />
            Continue with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
