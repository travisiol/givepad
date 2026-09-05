import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "support",
  description: `how to reach ${site.name}, and what we can actually help with.`,
};

const rows = [
  {
    k: "a cause you want opened",
    v: `the registry is deliberately short. if you run — or work with — an organisation that could take payouts on ${site.chain.name}, that is the conversation worth having.`,
  },
  {
    k: "a token you launched",
    v: "the split is in the contract and we cannot change it. that is the point, and it means we also cannot fix a typo in it. check the preview before you sign.",
  },
  {
    k: "a claim about a payout",
    v: `every settled payout is a transaction on ${site.chain.name}. if a page shows a figure you cannot find on the explorer, that is a bug and we want to hear about it.`,
  },
  {
    k: "press, partnerships, everything else",
    v: `${site.xHandle} on X. ${site.partner.name} handles the verification side.`,
  },
];

export default function SupportPage() {
  return (
    <div className="pb-8">
      <header className="pt-8">
        <span className="kicker">support</span>
        <h1 className="mt-4 [font-size:clamp(34px,5vw,56px)]">what we can help with.</h1>
        <p className="mt-5 max-w-2xl text-ink-60">
          there is no support desk yet, because there is nothing deployed to support. what exists
          is one inbox and a short list of things worth sending to it.
        </p>
      </header>

      <section className="mt-10 card divide-y divide-divider">
        {rows.map((r) => (
          <div key={r.k} className="px-6 py-6 sm:px-8">
            <h2 className="text-[18px]">{r.k}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-60">{r.v}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 panel text-center">
        <span className="kicker">the only channel</span>
        <p className="mt-3 text-[22px] font-extrabold tracking-tight">
          <a className="link" href={site.xUrl} target="_blank" rel="noreferrer">
            {site.xHandle}
          </a>
        </p>
        <p className="mt-4 mx-auto max-w-lg text-[13px] leading-relaxed text-muted">
          anyone dming you an address, a presale, or a &ldquo;team wallet&rdquo; in the name of{" "}
          {site.name} is not us. nothing is deployed, so there is nothing to send funds to.
        </p>
      </section>
    </div>
  );
}
