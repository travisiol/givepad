import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CauseTile } from "@/components/CauseTile";
import { GivenCounter, SampleNote } from "@/components/Given";
import { TokenTable } from "@/components/TokenTable";
import { causes, findCause } from "@/lib/causes";
import { feesToCause } from "@/lib/given";
import { usdCompact } from "@/lib/format";
import { site } from "@/lib/site";
import { tokensForCause } from "@/lib/tokens";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return causes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const cause = findCause(slug);
  if (!cause) return { title: "cause not found" };
  return { title: cause.label, description: cause.blurb };
}

export default async function CausePage({ params }: Params) {
  const { slug } = await params;
  const cause = findCause(slug);
  if (!cause) notFound();

  const tokens = tokensForCause(cause.slug);
  const routed = tokens.reduce((sum, t) => sum + feesToCause(t.volumeUsd), 0);

  return (
    <div className="pb-8">
      <header className="pt-8">
        <Link className="kicker hover:text-primary transition-colors" href="/causes">
          ← the registry
        </Link>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <CauseTile slug={cause.slug} size={104} />
          <div>
            <h1 className="[font-size:clamp(32px,4.6vw,52px)]">{cause.label}</h1>
            <p className="mt-3 max-w-xl text-ink-60">{cause.blurb}</p>
          </div>
        </div>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="card card-sm p-6">
          <span className="kicker">tokens on this cause</span>
          <p className="mt-2 text-[32px] font-extrabold tracking-[-0.03em] leading-none">
            {tokens.length}
          </p>
        </div>
        <div className="card card-sm p-6">
          <span className="kicker">would route at current volume</span>
          <p className="mt-2 text-[32px] font-extrabold tracking-[-0.03em] leading-none text-rose-text">
            {usdCompact(routed)}
          </p>
          <p className="mt-2 text-[12px] leading-snug text-subtle">
            {site.isLive ? "from indexed volume" : "arithmetic on the example rows below"}
          </p>
        </div>
        <div className="card card-sm p-6">
          <span className="kicker">settled to this cause</span>
          <p className="mt-2 text-[32px] font-extrabold tracking-[-0.03em] leading-none">$0</p>
          <p className="mt-2 text-[12px] leading-snug text-subtle">
            no payout has been published on {site.chain.name}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="panel">
          <span className="kicker">who receives it</span>
          {cause.orgs.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {cause.orgs.map((o) => (
                <li key={o.name} className="text-[15px] font-semibold">
                  {o.name}
                  {o.ein && <span className="ml-2 text-muted font-medium">EIN {o.ein}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <h2 className="mt-3 text-[24px]">nobody has been named yet.</h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-60">
                this is not an oversight. an organisation goes on this page when{" "}
                {site.partner.name} holds a signed agreement with it <em>and</em> a payout address
                it has confirmed on {site.chain.name}. a donation address published for mainnet is
                usually custodial and reusing it on another chain strands the money for good, so
                &ldquo;we found their address online&rdquo; is not enough to ship.
              </p>
              <p className="mt-4 text-[13px] text-muted">
                until then the splitter for this cause is unset, which is why the launch form
                refuses to submit.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[26px]">tokens paying this cause</h2>
          {!site.isLive && <span className="badge badge-neutral">awaiting launch</span>}
        </div>
        <SampleNote />
        {tokens.length > 0 ? (
          <div className="mt-6">
            <TokenTable tokens={tokens} showCause={false} />
          </div>
        ) : (
          <div className="card card-sm mt-6 p-8 text-center">
            <p className="text-ink-60">
              nothing has launched on this cause yet.{" "}
              <Link className="link" href="/launch">
                be the first
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      <section className="mt-10">
        <GivenCounter className="max-w-2xl mx-auto" />
      </section>
    </div>
  );
}
