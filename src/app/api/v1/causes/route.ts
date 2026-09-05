import { causes } from "@/lib/causes";
import { json, preflight } from "@/lib/api";
import { site } from "@/lib/site";
import { seedTokens } from "@/lib/tokens";

export const dynamic = "force-static";

export function OPTIONS() {
  return preflight();
}

/**
 * The registry. `verified` is the field that matters: false everywhere until
 * an organisation has signed and has a payout address confirmed on chain.
 */
export function GET() {
  return json({
    partner: site.partner.name,
    chain: site.chain.name,
    note: `causes are categories. an organisation is attached to one only after ${site.partner.name} holds a signed agreement and a payout address confirmed on ${site.chain.name}.`,
    causes: causes.map((c) => ({
      slug: c.slug,
      label: c.label,
      blurb: c.blurb,
      verified: c.orgs.length > 0,
      orgs: c.orgs,
      recipientAddress: null,
      tokens: seedTokens.filter((t) => t.cause === c.slug).length,
      url: `${site.url}/causes/${c.slug}`,
    })),
  });
}
