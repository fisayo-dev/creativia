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
| `BACHS_API_KEY` | bachs secret key (`sk_sandbox_…` / `sk_live_…`) |
| `BACHS_API_URL` | `https://sandbox-api.bachs.io` or `https://api.bachs.io` |
| `BACHS_WEBHOOK_SECRET` | signing secret for the webhook at `/api/webhooks/bachs` |

## structure

```
actions/      server actions (donation checkout)
app/          routes: / · /play · /donate · /donate/thanks · /result · api/score-image · api/webhooks/bachs
assets/       nunito ttfs for the generated score image
components/   ui primitives, game screens, stats, share, donate, layout
config/       site, game (difficulty, lengths, scoring, ranks), donate settings
hooks/        use-game (reducer), use-sound, use-elapsed
lib/          words bank, game logic, sounds, bachs client, score image renderer
types/        shared types
utils/        formatting, text, share helpers
```

all 310 puzzles live in `lib/words.ts` as the `WORDS` variable.
