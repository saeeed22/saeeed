# Portfolio — Saeed Ahmed

A cinematic personal portfolio with a self-hosted admin dashboard, built on Next.js 16, GSAP, Lenis, Tailwind v4, Drizzle, and Auth.js.

## Run it locally

```bash
npm install
cp .env.local.example .env.local      # fill in the values (see below)
npm run dev
```

Visit http://localhost:3000

## Environment variables

All secrets live in `.env.local` (git-ignored). Copy `.env.local.example` and fill these:

| Variable | What it does | Required for |
|---|---|---|
| `DATABASE_URL` | Where projects are stored. `file:./local.db` for local dev, `libsql://...turso.io` for prod | Always |
| `DATABASE_AUTH_TOKEN` | Turso auth token | Production only |
| `AUTH_SECRET` | Signs session cookies. Generate: `openssl rand -base64 32` | `/admin` login |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID | `/admin` login |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret | `/admin` login |
| `RESEND_API_KEY` | Resend API key for contact form delivery | Contact form |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token (prod uploads) | Production uploads |

### Where to get each

- **GitHub OAuth** — https://github.com/settings/developers → New OAuth App. Callback: `http://localhost:3000/api/auth/callback/github` (or your prod URL).
- **Resend** — https://resend.com/api-keys
- **Turso** — `turso db tokens create saeed-portfolio` (after `brew install tursodatabase/tap/turso` + `turso auth signup`)
- **Vercel Blob** — Vercel project → Storage → Blob → Connect → copy token

## Stack

- **Next.js 16** (App Router, Webpack, React 19)
- **TypeScript** + **Tailwind CSS v4**
- **shadcn/ui** components
- **GSAP + ScrollTrigger** for scroll-driven animations
- **Lenis** for smooth scroll
- **Framer Motion** + **Lucide** for micro-interactions
- **next-themes** — dark default with light toggle
- **React Hook Form + Zod** — typed forms
- **Resend** — contact form delivery
- **Auth.js v5** — GitHub OAuth, username-gated to a single user
- **Drizzle ORM + libSQL** — local SQLite in dev, Turso in prod (same code)
- **Vercel Blob** — production image uploads (falls back to local FS in dev)

## Public sections

1. **Hero** — GSAP timeline with line-by-line reveal and editorial italic accents
2. **About** — portrait card + scroll-scrubbed word-by-word text reveal
3. **Skills** — infinite marquee + categorized toolkit list
4. **Projects** — sticky-stacking cards with scroll-driven scale, links to per-project case studies
5. **Experience** — vertical timeline with scroll-drawn coral line
6. **Contact** — Resend-powered form with honeypot, validation, success animation

## Admin dashboard (`/admin`)

- Login at `/admin/login` via GitHub OAuth — gated to a single GitHub username (see `src/lib/auth.ts`)
- Create / edit / delete projects from a clean dashboard
- Upload thumbnails and gallery images (drag-drop, multi-file)
- Tag-style input for tech stack
- Featured / draft / published toggles
- Public site reads from the same DB and revalidates automatically

## Theming

Monochrome with a single coral accent. To change the accent, edit `--coral` in `src/app/globals.css` — propagates everywhere.

## Database — local vs production

The `drizzle.config.ts` auto-detects which driver to use based on `DATABASE_URL`:

- Starts with `file:` → SQLite (local dev)
- Starts with `libsql://` or `https://` → Turso

Push schema changes with:
```bash
npx drizzle-kit push
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import on Vercel
3. Add env vars in Project Settings → Environment Variables:
   - `DATABASE_URL` (Turso URL)
   - `DATABASE_AUTH_TOKEN` (fresh Turso token)
   - `AUTH_SECRET`
   - `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` (use a **new** OAuth app with prod callback URL)
   - `RESEND_API_KEY`
   - `BLOB_READ_WRITE_TOKEN` (connect a Blob store via Vercel dashboard)
4. Deploy

## Project structure

```
saeed/
├── src/
│   ├── app/
│   │   ├── admin/              # gated dashboard
│   │   ├── api/                # contact, admin CRUD, upload, auth
│   │   ├── projects/[slug]/    # public project detail page
│   │   ├── layout.tsx
│   │   └── page.tsx            # home composition
│   ├── components/
│   │   ├── admin/              # admin-only UI (form, delete button)
│   │   ├── sections/           # public homepage sections
│   │   ├── ui/                 # shadcn primitives
│   │   ├── providers/          # theme + smooth-scroll providers
│   │   ├── brand-icons.tsx     # GitHub / LinkedIn SVGs
│   │   ├── site-nav.tsx
│   │   ├── site-footer.tsx
│   │   └── theme-toggle.tsx
│   ├── db/
│   │   ├── schema.ts           # Drizzle table definitions
│   │   └── client.ts           # libSQL client
│   ├── lib/
│   │   ├── auth.ts             # Auth.js config (allowed GitHub login)
│   │   ├── projects-repo.ts    # DB queries for projects
│   │   ├── site.ts             # static site config + nav, skills, experience
│   │   └── utils.ts            # cn() helper
│   └── middleware.ts           # gates /admin routes
├── public/
│   ├── saeed.png               # portrait
│   └── uploads/                # local dev image uploads (git-ignored)
├── drizzle/                    # generated migrations
├── drizzle.config.ts
├── next.config.ts
├── .env.local                  # secrets (git-ignored)
└── .env.local.example          # template
```

## Security

- Never commit `.env.local` — `.gitignore` blocks all `.env*` except the example
- `local.db` and `public/uploads/` are git-ignored
- Rotate `AUTH_SECRET` if it ever leaks (will invalidate all current sessions)
- Use separate GitHub OAuth apps for dev and prod (each can only have one callback URL)
