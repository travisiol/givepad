/**
 * The cause registry.
 *
 * A deliberate design decision: **this list holds causes, not organisations.**
 *
 * Naming a charity as the beneficiary of something you sell is a regulated act
 * in a lot of places — in about half of US states it is a "commercial
 * co-venture" and needs a written agreement with the organisation *before* the
 * announcement, plus permission for the name and the logo. Large charities
 * have had to publicly disown tokens that named them without asking.
 *
 * So a launcher picks a cause here, and donate.gg — which does the diligence
 * and holds the payout address — maps it to a verified organisation. Until an
 * organisation has signed, `orgs` is empty and the cause page says so instead
 * of borrowing someone's name for decoration.
 */
export type Cause = {
  slug: string;
  /** what the launcher picks */
  label: string;
  /** one line, lowercase, used on cards and in the launch form */
  blurb: string;
  /** the tile colour — the only place a non-rose hue is allowed to be loud */
  color: string;
  /** which glyph <CauseGlyph /> draws */
  glyph: string;
  /**
   * organisations donate.gg has verified for this cause, with a payout address
   * confirmed **on robinhood chain**. empty everywhere until that paperwork
   * exists — see the note in docs/ about custodial mainnet-only addresses.
   */
  orgs: { name: string; ein?: string }[];
};

export const causes: Cause[] = [
  {
    slug: "clean-water",
    label: "clean water",
    blurb: "wells, filters and pipes for places that have none.",
    color: "#2ec6d8",
    glyph: "drop",
    orgs: [],
  },
  {
    slug: "pediatric-cancer",
    label: "pediatric cancer",
    blurb: "treatment, research and families who stopped working to sit in a ward.",
    color: "#f2b632",
    glyph: "ribbon",
    orgs: [],
  },
  {
    slug: "food-security",
    label: "food security",
    blurb: "food banks and school meals, measured in meals rather than dollars.",
    color: "#f2762e",
    glyph: "bowl",
    orgs: [],
  },
  {
    slug: "disaster-relief",
    label: "disaster relief",
    blurb: "the first two weeks after a flood, a quake or a fire.",
    color: "#e8534b",
    glyph: "shelter",
    orgs: [],
  },
  {
    slug: "animal-rescue",
    label: "animal rescue",
    blurb: "shelters, vet bills and the transport between the two.",
    color: "#a9713f",
    glyph: "paw",
    orgs: [],
  },
  {
    slug: "reforestation",
    label: "reforestation",
    blurb: "planting, and the five years of tending that decide whether it took.",
    color: "#3aa76d",
    glyph: "tree",
    orgs: [],
  },
  {
    slug: "education",
    label: "education",
    blurb: "school fees, books and the bus that gets a kid to the desk.",
    color: "#8b5cf6",
    glyph: "book",
    orgs: [],
  },
  {
    slug: "shelter",
    label: "housing & shelter",
    blurb: "beds tonight, and deposits for the people who can leave a shelter.",
    color: "#4d7ec9",
    glyph: "house",
    orgs: [],
  },
  {
    slug: "mental-health",
    label: "mental health",
    blurb: "crisis lines and the therapy hours nobody's insurance covers.",
    color: "#37a08e",
    glyph: "mind",
    orgs: [],
  },
  {
    slug: "open-source",
    label: "open source",
    blurb: "maintainers of the libraries this whole industry runs on, unpaid.",
    color: "#5b6ee8",
    glyph: "brackets",
    orgs: [],
  },
];

export function findCause(slug: string): Cause | undefined {
  return causes.find((c) => c.slug === slug);
}

export function causeLabel(slug: string): string {
  return findCause(slug)?.label ?? slug;
}

export function causeColor(slug: string): string {
  return findCause(slug)?.color ?? "#ff5aa8";
}

/** true once at least one cause has a verified organisation behind it */
export const registryHasOrgs = causes.some((c) => c.orgs.length > 0);
