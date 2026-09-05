import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "terms",
  description: `terms of use for ${site.domain}.`,
};

const sections = [
  {
    h: "1. what this is",
    p: `${site.name} is a web interface for deploying a token on ${site.venue.name}, a bonding-curve venue on ${site.chain.name}, with a fee split written into the deployment. it is software. it is not a charity, a broker, an exchange, a custodian, or an adviser, and it does not hold user funds at any point.`,
  },
  {
    h: "2. tokens are not donations",
    p: "buying a token launched through this interface is not a charitable contribution. it is not tax deductible, no receipt is issued, and no organisation is thereby your donee. the only claim made anywhere on this site is that a token's fee stream is routed to a splitter contract with an immutable recipient.",
  },
  {
    h: "3. no affiliation",
    p: `no organisation named on this site is affiliated with ${site.name} unless this page says so explicitly. the cause registry lists categories. an organisation is associated with a category only after ${site.partner.name} has a written agreement with it and a payout address it has confirmed on ${site.chain.name}.`,
  },
  {
    h: "4. risk",
    p: "tokens launched here can and often will go to zero. bonding curves are adversarial environments. nothing on this site is investment advice, a solicitation, or a promise of any return, and you should assume total loss is a normal outcome.",
  },
  {
    h: "5. immutability cuts both ways",
    p: "the fee split cannot be changed after deployment. that is the product's central guarantee, and it also means an error in a launch — the wrong cause, a misspelled name, a bad image — cannot be corrected by us or by you. review the preview before signing.",
  },
  {
    h: "6. availability",
    p: "the interface is provided as-is, with no uptime commitment. the contracts, once deployed, do not depend on this site being reachable: the splitter's release function is callable by anyone, from any client.",
  },
  {
    h: "7. jurisdiction and eligibility",
    p: "you are responsible for whether using this interface is lawful where you are, including any local rules on charitable solicitation and on trading digital assets. do not use it where it is not.",
  },
];

export default function TermsPage() {
  return (
    <div className="pb-8">
      <header className="pt-8">
        <span className="kicker">terms</span>
        <h1 className="mt-4 [font-size:clamp(34px,5vw,56px)]">terms of use.</h1>
        <p className="mt-5 max-w-2xl text-ink-60">
          plain language, and short enough to read. last revised alongside the site — no
          organisation, regulator or lawyer has reviewed it yet.
        </p>
      </header>

      <section className="mt-10 panel">
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="text-[19px]">{s.h}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-60">{s.p}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 pt-6 border-t border-divider text-[13px] leading-relaxed text-subtle">
          this document is structured boilerplate written by the people who built the site. it is
          not legal advice and it has not been reviewed by counsel. anything routing real money to
          real charities needs that review first — particularly the commercial co-venture rules
          that apply in much of the united states.
        </p>
      </section>
    </div>
  );
}
