import type { Metadata } from "next";
import Link from "next/link";
import { GivenCounter, SampleNote } from "@/components/Given";
import { TokenTable } from "@/components/TokenTable";
import { causes } from "@/lib/causes";
import { site } from "@/lib/site";
import { seedTokens } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "tokens",
  description: `every token launched through ${site.name}, and the cause each one pays.`,
};

export default function TokensPage() {
  const byCause = causes
    .map((c) => ({ cause: c, count: seedTokens.filter((t) => t.cause === c.slug).length }))
    .filter((r) => r.count > 0);

  return (
    <div className="pb-8">
      <header className="pt-8 pb-2">
        <span className="kicker">the board</span>
        <h1 className="mt-4 [font-size:clamp(34px,5vw,56px)]">every token, and who it pays.</h1>
        <p className="mt-5 max-w-2xl text-ink-60">
          sorted the way a launchpad usually sorts — newest first, curve progress visible — with
          one column the others don&rsquo;t have: what this token&rsquo;s volume has routed to its
          cause at the split written into its contract.
        </p>
        <SampleNote />
      </header>

      <section className="mt-8">
        <TokenTable tokens={seedTokens} />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-[1.2fr_1fr] items-start">
        <div className="card card-sm p-7">
          <span className="kicker">by cause</span>
          <ul className="mt-4 flex flex-wrap gap-2">
            {byCause.map(({ cause, count }) => (
              <li key={cause.slug}>
                <Link
                  href={`/causes/${cause.slug}`}
                  className="badge badge-neutral hover:text-primary transition-colors"
                >
                  {cause.label} · {count}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13px] leading-relaxed text-muted">
            a cause with no tokens is still in the registry — it is waiting for someone to launch
            one, not hidden.
          </p>
        </div>

        <GivenCounter />
      </section>
    </div>
  );
}
