import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "privacy",
  description: `what ${site.domain} collects, which is close to nothing.`,
};

const sections = [
  {
    h: "what we collect",
    p: "no account, no email, no analytics script, no third-party tags. the site is served as static pages and the only network calls it makes are to its own api and, when configured, to an indexer.",
  },
  {
    h: "what your browser stores",
    p: "one localStorage entry, givepad:balloon:…, holding the rendered wordmark so it does not have to be computed again on the next visit. it contains an image and nothing else. clearing site data removes it.",
  },
  {
    h: "what is public anyway",
    p: `everything on ${site.chain.name} is public by construction: launches, swaps, fee routing and payouts, all tied to addresses. this site does not link addresses to identities, but it cannot make on-chain activity private either.`,
  },
  {
    h: "wallets",
    p: "connecting a wallet exposes its address to the page, which is how any dapp works. no signature is requested for anything except a transaction you initiated, and no key material ever reaches this site or its servers.",
  },
  {
    h: "logs",
    p: "the host keeps standard request logs (ip, user agent, path) for operational reasons. they are not used to build a profile and are not sold or shared.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pb-8">
      <header className="pt-8">
        <span className="kicker">privacy</span>
        <h1 className="mt-4 [font-size:clamp(34px,5vw,56px)]">what we collect.</h1>
        <p className="mt-5 max-w-2xl text-ink-60">
          close to nothing, and this page is short because there is not much to describe.
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
          structured boilerplate, not reviewed by counsel — same caveat as the terms. if an
          analytics or wallet vendor is added later, this page has to change before that ships.
        </p>
      </section>
    </div>
  );
}
