import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { LogOut, Plus } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen pt-20">
      {session?.user && (
        <header className="fixed top-16 inset-x-0 z-40 border-y border-border bg-background/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-display text-lg">
                Admin<span className="text-coral">.</span>
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                  Projects
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-1.5 text-sm rounded-full bg-coral text-coral-foreground px-3.5 py-1.5 hover:bg-coral/90"
              >
                <Plus className="h-3.5 w-3.5" /> New
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </header>
      )}
      <div className={session?.user ? "pt-20" : ""}>{children}</div>
    </div>
  );
}
