import { site } from "./site";

/**
 * Every address the site would need, read from the environment.
 *
 * None of them are set, and none of them have a placeholder: an address that
 * looks deployed is worse than a blank, because somebody will send funds to
 * it. Unset renders as "awaiting launch" wherever it appears.
 */
export type Contract = {
  key: string;
  label: string;
  blurb: string;
  address: string | null;
  /** the env var that fills it in */
  env: string;
};

export const contracts: Contract[] = [
  {
    key: "factory",
    label: "LaunchFactory",
    blurb: `deploys a token on ${site.venue.name} and writes its cause split in the same transaction.`,
    address: process.env.NEXT_PUBLIC_GIVEPAD_FACTORY ?? null,
    env: "NEXT_PUBLIC_GIVEPAD_FACTORY",
  },
  {
    key: "splitter",
    label: "CauseSplitter",
    blurb:
      "holds the fee stream of one launch. the recipient is immutable, there is no owner and no withdraw — release() is external and unguarded, so anyone can push the money out.",
    address: process.env.NEXT_PUBLIC_GIVEPAD_SPLITTER ?? null,
    env: "NEXT_PUBLIC_GIVEPAD_SPLITTER",
  },
  {
    key: "registry",
    label: "CauseRegistry",
    blurb: `maps a cause slug to the payout address ${site.partner.name} has verified for it. append-only.`,
    address: process.env.NEXT_PUBLIC_GIVEPAD_REGISTRY ?? null,
    env: "NEXT_PUBLIC_GIVEPAD_REGISTRY",
  },
  {
    key: "token",
    label: `$${site.ticker}`,
    blurb: "the house token, launched through the same factory as everything else.",
    address: process.env.NEXT_PUBLIC_GIVEPAD_TOKEN ?? null,
    env: "NEXT_PUBLIC_GIVEPAD_TOKEN",
  },
];

export const anyDeployed = contracts.some((c) => c.address);

export function explorerUrl(address: string): string {
  return `${site.chain.explorer}/address/${address}`;
}
