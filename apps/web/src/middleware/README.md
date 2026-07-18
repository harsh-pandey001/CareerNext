# middleware

Edge/route middleware helpers for the web app (auth-guard redirects, locale,
etc.). The composed Next.js entrypoint lives at `apps/web/middleware.ts` (root
of the app, as Next requires) and delegates to helpers defined here.

Route protection based on JWT/refresh tokens is wired in during V1
authentication.
