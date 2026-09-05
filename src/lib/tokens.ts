import { site } from "./site";

export type Token = {
  address: string;
  name: string;
  symbol: string;
  description: string;
  /** the cause slug this launch is locked to, from lib/causes.ts */
  cause: string;
  /** what the curve quotes in */
  pair: string;
  priceUsd: number;
  marketCapUsd: number;
  volumeUsd: number;
  /** progress along the pons v2 bonding curve towards graduation, 0–100 */
  curvePct: number;
  /** the share of the swap fee written into the contract at launch */
  causeSharePct: number;
  createdAt: number;
  creator: string;
  creatorHandle: string;
  links?: { website?: string; x?: string };
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** resolved once at import so the seed set is stable within a render pass */
const NOW = Date.now();

/**
 * The example set.
 *
 * Nothing is deployed, so rather than an empty table the explore and tokens
 * pages render this and label it in one line above the numbers. Set
 * NEXT_PUBLIC_GIVEPAD_API and it is replaced wholesale by the indexer's
 * /api/v1/tokens response.
 *
 * Two rules held here: the launcher handles are fictional — a demo should not
 * imply that real accounts have run a charity token — and no row carries a
 * "given" figure. What a row's volume *would* have routed is computed on the
 * fly by feesToCause() and always rendered next to the sample note, never
 * added to the site total. See lib/given.ts.
 */
export const seedTokens: Token[] = [
  {
    address: "0xcff9fb61a0d3e4c85b27f4a1c6d09e3b58471f2a",
    name: "Givepad",
    symbol: "GIVE",
    description:
      "the house token. its fee share funds the same registry every other launch here uses.",
    cause: "clean-water",
    pair: "ETH",
    priceUsd: 0.0000094,
    marketCapUsd: 9400,
    volumeUsd: 21400,
    curvePct: 9,
    causeSharePct: 100,
    createdAt: NOW - 22 * MINUTE,
    creator: "0x5905165f43e6c1a4bd7e2f0c8a91b3d6e04f2d11",
    creatorHandle: "givepad",
    links: { website: site.url, x: site.xUrl },
  },
  {
    address: "0x3b8e1d47a92c05f6b3d8e01a7c45f92b6d130ae8",
    name: "Well Dug",
    symbol: "WELL",
    description: "a token for boreholes. the curve pays the drilling, not the marketing.",
    cause: "clean-water",
    pair: "ETH",
    priceUsd: 0.000041,
    marketCapUsd: 41200,
    volumeUsd: 128900,
    curvePct: 38,
    causeSharePct: 100,
    createdAt: NOW - 3 * HOUR,
    creator: "0x91c4e07d2b6a5f38c0e91d47b25a6f0c8d3e1927",
    creatorHandle: "borehole",
  },
  {
    address: "0x6d0a94f27c31b8e5a0f62d4b19c7e830a5b2f4c6",
    name: "Gold Ribbon",
    symbol: "RIBBON",
    description:
      "every swap sends its whole fee to pediatric cancer. the ribbon fills as the payouts settle.",
    cause: "pediatric-cancer",
    pair: "USDG",
    priceUsd: 0.00027,
    marketCapUsd: 271000,
    volumeUsd: 612000,
    curvePct: 71,
    causeSharePct: 100,
    createdAt: NOW - 2 * DAY,
    creator: "0x4f7b2e1a95d0c86b3f14a7e29d05c6b81f3a2e40",
    creatorHandle: "ribbonday",
  },
  {
    address: "0x82f5c13d0a6e947b1c58fd23e06a4b79c1d5e830",
    name: "Ward Nine",
    symbol: "WARD",
    description: "for the families who stopped working to sit in a ward.",
    cause: "pediatric-cancer",
    pair: "ETH",
    priceUsd: 0.0000073,
    marketCapUsd: 7300,
    volumeUsd: 9800,
    curvePct: 4,
    causeSharePct: 100,
    createdAt: NOW - 41 * MINUTE,
    creator: "0x2a91f60d4c73b8e5a1f09d26b47c3e850a6f1d92",
    creatorHandle: "wardnine",
  },
  {
    address: "0x15e93a7c40db268f5a03c1e94b7d602f8a3c56d1",
    name: "Hot Meals",
    symbol: "MEAL",
    description: "denominated in meals. 1.4 meals per dollar, published every friday.",
    cause: "food-security",
    pair: "USDG",
    priceUsd: 0.000088,
    marketCapUsd: 88400,
    volumeUsd: 264000,
    curvePct: 52,
    causeSharePct: 100,
    createdAt: NOW - 9 * HOUR,
    creator: "0x7c0e5b93a1d264f8b05e37c1a92d6f40b8e5c317",
    creatorHandle: "hotmeals",
  },
  {
    address: "0x9a47c2e05b1d386f4a09e75c2b13d8f60c4a71e9",
    name: "First Two Weeks",
    symbol: "F2W",
    description: "relief spends fastest right after the water goes down. so does this.",
    cause: "disaster-relief",
    pair: "ETH",
    priceUsd: 0.000016,
    marketCapUsd: 15900,
    volumeUsd: 47300,
    curvePct: 21,
    causeSharePct: 100,
    createdAt: NOW - 6 * HOUR,
    creator: "0x3e18d5a97c02b64f1a8d05e73c26b9f40a7d1c58",
    creatorHandle: "f2wrelief",
  },
  {
    address: "0x4c72b1e98d05a36f2c40b8e17d59a03f6b28c4d7",
    name: "Kennel",
    symbol: "KENNEL",
    description: "vet bills, transport, and the week between a seizure and an adoption.",
    cause: "animal-rescue",
    pair: "ETH",
    priceUsd: 0.000033,
    marketCapUsd: 33100,
    volumeUsd: 91500,
    curvePct: 31,
    causeSharePct: 100,
    createdAt: NOW - 19 * HOUR,
    creator: "0x6b0f4d281e95c73a0f6b2d84e17c95a30d2f6b81",
    creatorHandle: "kennelrun",
  },
  {
    address: "0x27d3f04b6a19e85c3d02f7b14a68c9e50d1b3a76",
    name: "Canopy",
    symbol: "CANOPY",
    description:
      "planting is the cheap part. this pays the five years of tending that decide whether it took.",
    cause: "reforestation",
    pair: "USDG",
    priceUsd: 0.00012,
    marketCapUsd: 124000,
    volumeUsd: 338000,
    curvePct: 63,
    causeSharePct: 100,
    createdAt: NOW - 4 * DAY,
    creator: "0x8f21c05e73b4a96d1c80f5e23a7b04d69c1e5a38",
    creatorHandle: "canopyfund",
  },
  {
    address: "0x51a8e37c02d94b6f8a15c03e29d7b46f0a8c2e15",
    name: "Bus Fare",
    symbol: "FARE",
    description: "school fees, books, and the bus that gets a kid to the desk.",
    cause: "education",
    pair: "ETH",
    priceUsd: 0.0000058,
    marketCapUsd: 5800,
    volumeUsd: 6200,
    curvePct: 3,
    causeSharePct: 100,
    createdAt: NOW - 12 * MINUTE,
    creator: "0x0d6a83f15c27e94b0a36d1f85c72b0e94a3d6f17",
    creatorHandle: "busfare",
  },
  {
    address: "0x7e40b19d5a83c26f0b47e1d38c95a2f70b6d3e84",
    name: "Deposit",
    symbol: "DEPO",
    description: "beds tonight, and the first month's rent for the people who can leave one.",
    cause: "shelter",
    pair: "USDG",
    priceUsd: 0.000059,
    marketCapUsd: 58700,
    volumeUsd: 143000,
    curvePct: 44,
    causeSharePct: 100,
    createdAt: NOW - 31 * HOUR,
    creator: "0x1f95c0e847a3d26b91c05f7e48a2d6b30c9a41e75",
    creatorHandle: "depositfund",
  },
  {
    address: "0x3a9f27c81e05b64d0a72f3c19e85b40d7c26a1f9",
    name: "Third Shift",
    symbol: "SHIFT",
    description: "crisis lines are staffed overnight by people paid for eight hours of nine.",
    cause: "mental-health",
    pair: "ETH",
    priceUsd: 0.000021,
    marketCapUsd: 21400,
    volumeUsd: 52800,
    curvePct: 26,
    causeSharePct: 100,
    createdAt: NOW - 15 * HOUR,
    creator: "0x5c73e08b1a24d96f0c58b3e17a04d2f96b8c1e35",
    creatorHandle: "thirdshift",
  },
  {
    address: "0x8b16d05a92c47f3e0b81d64a25c93f70e1a5d284",
    name: "Maintainer",
    symbol: "MAINT",
    description: "for the four people holding up the dependency tree under all of this.",
    cause: "open-source",
    pair: "ETH",
    priceUsd: 0.000074,
    marketCapUsd: 74600,
    volumeUsd: 196000,
    curvePct: 57,
    causeSharePct: 100,
    createdAt: NOW - 2 * DAY - 4 * HOUR,
    creator: "0x9d05a3f81c62b47e0a19d5c83f26b40a7e1c9d52",
    creatorHandle: "maintainerfund",
  },
];

export function findToken(address: string): Token | undefined {
  const wanted = address.toLowerCase();
  return seedTokens.find((t) => t.address.toLowerCase() === wanted);
}

export function tokensForCause(slug: string): Token[] {
  return seedTokens.filter((t) => t.cause === slug);
}

/**
 * A deterministic price walk for a token, so the chart is stable across renders
 * and reloads instead of dancing on every paint.
 */
export function priceSeries(token: Token, points = 96): { t: number; p: number }[] {
  let seed = 0;
  for (let i = 0; i < token.address.length; i++) {
    seed = (seed * 31 + token.address.charCodeAt(i)) >>> 0;
  }

  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  const span = NOW - token.createdAt;
  const out: { t: number; p: number }[] = [];
  // walk backwards from the current price so the last point is always exact.
  // stepping back shrinks the price, so forward in time it climbs — and it
  // climbs faster for a token that has eaten more of its curve.
  const drift = 0.995 - (token.curvePct / 100) * 0.012;
  let p = token.priceUsd;
  for (let i = points - 1; i >= 0; i--) {
    out[i] = { t: token.createdAt + (span * i) / (points - 1), p };
    p = p * (drift + rand() * 0.012);
  }
  return out;
}

export function ageLabel(createdAt: number): string {
  const ms = NOW - createdAt;
  const m = Math.floor(ms / MINUTE);
  if (m < 60) return `${Math.max(1, m)}m`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
