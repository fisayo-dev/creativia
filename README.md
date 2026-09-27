# creativia

a gamified [remote associates test](https://www.remote-associates-test.com/). see three words, find the one word that links them, climb from very easy to very hard.

## run it

```bash
cp .env.example .env.local
npm install
npm run dev
```

| variable | purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public url, used in share links and printed on the score image |
| `NEXT_PUBLIC_X_HANDLE` | optional x handle (no `@`) added as `via` when sharing |
| `PAYSTACK_SECRET_KEY` | paystack secret key (`sk_live_…` / `sk_test_…`). the key decides the mode |
| `SQUAD_SECRET_KEY` | squad secret key from profile → api & webhook |
| `SQUAD_API_URL` | `https://sandbox-api-d.squadco.com` or `https://api-d.squadco.com` |
| `BACHS_API_KEY` | bachs secret key (`sk_sandbox_…` / `sk_live_…`) |
| `BACHS_API_URL` | `https://sandbox-api.bachs.io` or `https://api.bachs.io` |
| `BACHS_WEBHOOK_SECRET` | signing secret for the webhook at `/api/webhooks/bachs` |

payment keys are server-only. they're read in `lib/payments/*` (guarded by `server-only`) and never reach the browser.
a provider without a key shows as "coming soon" in the donate form; one pointed at a sandbox shows a "test mode" badge.
the currency, presets and limits live in `config/donate.ts`.

webhooks: `/api/webhooks/paystack` · `/api/webhooks/squad` · `/api/webhooks/bachs`.
the thank-you page (`/donate/thanks/{provider}/{reference}`) asks the provider for the real amount before showing it.

## structure

```
actions/      server actions (donation checkout across squad, paystack and bachs)
app/          routes: / · /play · /donate · /donate/thanks/[provider]/[ref] · /result · api/score-image · api/webhooks/{paystack,squad,bachs}
assets/       nunito ttfs for the generated score image
components/   ui primitives, game screens, stats, share, donate, layout
config/       site, game (difficulty, lengths, scoring, ranks), donate settings
hooks/        use-game (reducer), use-sound, use-elapsed
lib/          words bank, game logic, sounds, payment clients (lib/payments), score image renderer
types/        shared types
utils/        formatting, text, share helpers
```

all 310 puzzles live in `lib/words.ts` as the `WORDS` variable.
