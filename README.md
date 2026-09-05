# givepad

**Every launch gives back.**

A launchpad for tokens whose fees are locked to a cause. You pick a cause, the
token deploys on a Pons V2 bonding curve on Robinhood Chain, and 100% of its
swap-fee share goes to a splitter contract whose recipient is set in the
constructor and can never be changed — not by the launcher, not by us.

Nothing is deployed. The site says so on every page that would otherwise imply
otherwise.

---

## The design rules

Three of them, and they are the reason several things look emptier than a
launchpad usually does.

**1. The donation figure is never seeded.** Market data can be illustrated —
a curve at 40%, a chart shape, a market cap — because those demonstrate a
mechanic. A running total of money given to charity demonstrates nothing; it
*is* the claim, and it is the figure that gets screenshotted. So `lib/given.ts`
reads the indexer or reads zero, and the hero says which. Example rows carry a
`<SampleNote />` in the same visual frame as the numbers.

**2. The registry holds causes, not organisations.** Naming a charity as the
beneficiary of something you sell is regulated — in roughly half of US states
it makes you a *commercial co-venturer*, needing a written agreement with the
organisation before the announcement plus separate permission for the name and
logo. Large charities have publicly disowned tokens that skipped this. So a
launcher picks `clean-water`, not an org, and `causes[].orgs` stays empty until
donate.gg has paperwork. `/causes` explains this rather than hiding it.

**3. An address is not portable.** The splitter pays on Robinhood Chain and
cannot bridge. The donation address an organisation publishes is usually a
custodial mainnet deposit address, and reusing it here would strand the money
permanently. A cause needs an address confirmed *on this chain*, in writing.

## The look

Blue sky, drifting clouds, white glass panels, inflated foil type, glossy 3D
cause tiles — and exactly one accent, rose, reserved for the giving side of the
product. Market figures stay in ink; the price chart is deliberately not rose.

The wordmark is **rendered per pixel in the browser**, not a PNG:
`src/lib/balloon.ts` takes an exact euclidean distance transform of each glyph
(Felzenszwalb), turns the distance into a circular cross-section, shades it with
Blinn-Phong (key light, warm bounce, tight glint plus broad sheen) and darkens
the last sliver into a weld seam. Letters are lit individually and painted left
to right with a contact shadow, so a bunch reads as balloons touching rather
than one blob. Everything derives from the string in `site.wordmark`, which is
what makes the brand renameable.

It costs ~450ms for an image that never changes, so it renders one letter per
task (the CSS fallback holds the layout meanwhile) and the result is cached as a
WebP data URL in `localStorage`. Bump the cache key in `BalloonCanvas.tsx` if the
renderer changes.

**A rendered wordmark wins if there is one.** `<Balloon />` is a server
component that stats `public/brand/hero.png` (or `.webp` / `.svg`) on every
render and uses it the moment it exists — no configuration. The nav logo can't
do that (it renders inside client components), so point `brandArt.mark` in
`lib/site.ts` at a square PNG to swap it.

## Routes

| path | what |
| --- | --- |
| `/` | hero, the real zero counter, how it works, the board, the registry |
| `/tokens` | every token, with a "to cause" column |
| `/causes` | the registry, and why it holds categories |
| `/causes/[slug]` | one cause: who receives it, what has settled (nothing) |
| `/token/[address]` | chart, curve, and the fee-path panel |
| `/launch` | the real form, closed by six named interlocks |
| `/docs` | the fee path, the contract, the chain trap, the api |
| `/support`, `/terms`, `/privacy` | small print |

API: `GET /api/v1/tokens`, `GET /api/v1/tokens/{address}`, `GET /api/v1/causes`,
`POST /api/v1/launch` — the last returns **501** naming the missing env var
instead of accepting a launch it cannot perform.

## Stack

Next 16.3.3 (App Router, React 19), Tailwind 3.4, TypeScript. **Zero runtime
dependencies** — the wordmark, the cause tiles, the chart and the icons are all
drawn by hand in canvas or SVG.

```bash
npm install
npm run dev
```

## Before this goes anywhere near real money

- `NEXT_PUBLIC_GIVEPAD_FACTORY` / `SPLITTER` / `REGISTRY` — nothing is deployed;
  every address on the site reads "awaiting launch" until these are set.
- `NEXT_PUBLIC_GIVEPAD_API` — without an indexer the board is an example set.
- **The registry needs a first organisation.** That is paperwork, not code: a
  signed agreement via donate.gg and a payout address confirmed on Robinhood
  Chain. Until then the launch form correctly refuses to submit.
- `/terms` and `/privacy` are structured boilerplate, not reviewed by counsel.
  Anything routing real money to real charities needs that review — starting
  with the commercial co-venture rules.
