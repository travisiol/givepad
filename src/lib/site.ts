/**
 * Every string that carries the brand lives here. Renaming givepad means
 * editing this file and nothing else on the copy side.
 */
export const site = {
  name: "givepad",
  /** what the balloon wordmark spells on the hero */
  wordmark: "givepad",
  /** the single letter that becomes the logo in the nav, footer and modal */
  mark: "g",
  ticker: "GIVE",
  url: process.env.NEXT_PUBLIC_GIVEPAD_URL ?? "https://givepad.tech",
  domain: "givepad.tech",
  xHandle: "@dotgivepad",
  xUrl: "https://x.com/dotgivepad",

  tagline: "every launch gives back.",
  description:
    "launch a token on pons v2 and lock 100% of its fees to a cause. the split is set at deploy time, lives in the contract, and nobody — including us — can move it afterwards.",

  chain: {
    name: "robinhood chain",
    id: 4663,
    explorer: "https://robinhoodchain.blockscout.com",
  },

  /** the curve the tokens actually trade on */
  venue: {
    name: "Pons V2",
    label: "pons v2",
  },

  /** who verifies a cause and holds the payout address on the other side */
  partner: {
    name: "donate.gg",
    handle: "@donatedotgg",
    url: "https://x.com/donatedotgg",
  },

  /** the launch fee quoted on the create page */
  launchFeeEth: 0.0005,
  /** the swap fee pons v2 charges, in percent */
  swapFeePct: 1,
  /** the share of that fee a givepad launch sends to its cause. not adjustable. */
  causeSharePct: 100,

  /**
   * false until a real indexer answers at NEXT_PUBLIC_GIVEPAD_API. while it is
   * false the tables render the example set in lib/tokens.ts and say so, and
   * every figure that represents money given reads zero — see lib/given.ts.
   */
  isLive: Boolean(process.env.NEXT_PUBLIC_GIVEPAD_API),
  apiBase: process.env.NEXT_PUBLIC_GIVEPAD_API ?? "",
} as const;

/**
 * Rendered brand art.
 *
 * The balloon is drawn live in the browser, which is what makes the name a
 * string — but a 3D render will always out-shine a canvas one.
 *
 * The **hero wordmark needs nothing here**: `<Balloon />` looks for
 * `public/brand/hero.png` (or .webp / .svg) on every render and uses it the
 * moment it exists.
 *
 * The **logo** can't do that — it renders inside client components, which have
 * no filesystem — so point `mark` at a square PNG in `public/brand/` to swap
 * it. Leave it empty and the drawn `g` stands.
 */
export const brandArt: { mark: string } = {
  mark: "",
};

export const nav = [
  { href: "/", label: "explore" },
  { href: "/tokens", label: "tokens" },
  { href: "/causes", label: "causes" },
  { href: "/launch", label: "create" },
  { href: "/docs", label: "docs" },
] as const;

export const footerNav = [
  ...nav,
  { href: "/support", label: "support" },
  { href: "/terms", label: "terms" },
  { href: "/privacy", label: "privacy" },
] as const;
