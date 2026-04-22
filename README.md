# Laila Web

Next.js frontend for the Laila fiduciary prototype.

## Required Environment Variables

Copy [`.env.example`](C:\Users\reda_\Desktop\Laila Prototype\web\.env.example) to `.env.local` for local work.

Production deployments require:

```env
SESSION_SECRET=replace-with-a-long-random-secret
```

Without `SESSION_SECRET`, login will fail in production because demo sessions are signed with JWT cookies.

## Local Run

```powershell
cd "C:\Users\reda_\Desktop\Laila Prototype\web"
pnpm install
pnpm dev
```

## Vercel Deployment

In Vercel, add this environment variable in `Project Settings > Environment Variables`:

```env
SESSION_SECRET=<long-random-secret>
```

Recommended way to generate one:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

After adding the variable, redeploy the project. Existing deployments do not automatically pick up a newly added secret.

## Demo Accounts

- `owner@laila.local` / `Laila2026!`
- `reviewer@laila.local` / `Laila2026!`
