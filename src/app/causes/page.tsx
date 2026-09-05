import type { Metadata } from "next";
import Link from "next/link";
import { CauseTile } from "@/components/CauseTile";
import { Reveal } from "@/components/Reveal";
import { causes, registryHasOrgs } from "@/lib/causes";
import { site } from "@/lib/site";
import { seedTokens } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "causes",
  description: `the ${site.name} cause registry — categories, not borrowed names.`,
};

export default function CausesPage() {
  return (
    <div className="pb-8">
      <header className="pt-8">
        <span className="kicker">the registry</span>
        <h1 className="mt-4 [font-size:clamp(34px,5vw,56px)]">
          ten causes. no borrowed names.
        </h1>
        <p className="mt-5 max-w-2xl text-ink-60">
          a launcher picks one of these, and the pick becomes a field in the deploy transaction.
          what it does <em>not</em> do is put a charity&rsquo;s name on a token that charity has
          never heard of.
        </p>
      </header>

      <Reveal className="mt-10">
        <div className="panel">
          <span className="kicker">why categories</span>
          <h2 className="mt-3 text-[24px]">naming a charity is a regulated act.</h2>
          <p className="mt-4 max-w-3xl text-ink-60 text-[15px] leading-relaxed">
            in about half of US states, selling something on the promise that a named charity
            benefits makes you a <em>commercial co-venturer</em>: it needs a written agreement with
            that organisation before the announcement, and separate permission for the name and the
            logo. large charities have had to publicly disown tokens that skipped this. so{" "}
            {site.name} lists causes, and {site.partner.name} — which does the diligence and holds
            the payout address — decides which organisation stands behind one.
          </p>
          <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-muted">
            {registryHasOrgs
              ? "the organisations below have signed and have a payout address confirmed on chain."
              : `no organisation has signed yet, so every cause below shows its category only. an
                 organisation appears here when ${site.partner.name} has a signed agreement and a
                 payout address confirmed on ${site.chain.name} — not a mainnet address reused,
                 which would strand the funds.`}
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {causes.map((c) => {
            const count = seedTokens.filter((t) => t.cause === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/causes/${c.slug}`}
                className="card card-sm p-6 flex gap-4 items-start hover:-translate-y-1 transition-transform"
              >
                <CauseTile slug={c.slug} size={64} />
                <span className="min-w-0">
                  <span className="block text-[17px] font-extrabold tracking-[-0.02em] leading-tight">
                    {c.label}
                  </span>
                  <span className="mt-2 block text-[14px] leading-relaxed text-ink-60">
                    {c.blurb}
                  </span>
                  <span className="mt-3 block text-[11px] font-bold uppercase tracking-kicker text-subtle">
                    {count === 0 ? "no launches yet" : `${count} token${count > 1 ? "s" : ""}`}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
