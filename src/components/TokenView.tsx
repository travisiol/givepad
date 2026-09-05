import Link from "next/link";
import { CauseTile } from "@/components/CauseTile";
import { PriceChart, type Point } from "@/components/PriceChart";
import { SampleNote } from "@/components/Given";
import { findCause } from "@/lib/causes";
import { feesToCause } from "@/lib/given";
import { shortAddress, usdCompact, usdPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { ageLabel, type Token } from "@/lib/tokens";

export function TokenView({ token, series }: { token: Token; series: Point[] }) {
  const cause = findCause(token.cause);
  const routed = feesToCause(token.volumeUsd);

  const facts = [
    { k: "pair", v: token.pair },
    { k: "venue", v: site.venue.name },
    { k: "contract", v: shortAddress(token.address, 6, 6) },
    { k: "launcher", v: `@${token.creatorHandle}` },
    { k: "age", v: ageLabel(token.createdAt) },
    { k: "fee split", v: `${token.causeSharePct}% to cause` },
  ];

  return (
    <div className="pb-8">
      <header className="pt-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <CauseTile slug={token.cause} size={84} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="[font-size:clamp(30px,4.2vw,46px)]">{token.name}</h1>
            <span className="badge badge-neutral">${token.symbol}</span>
          </div>
          <p className="mt-2 text-ink-60">
            paying{" "}
            <Link className="link" href={`/causes/${token.cause}`}>
              {cause?.label ?? token.cause}
            </Link>{" "}
            · launched by @{token.creatorHandle}
          </p>
        </div>
      </header>

      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-60">{token.description}</p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card card-sm p-5">
          <span className="kicker">price</span>
          <p className="mt-1.5 text-[24px] font-extrabold tracking-tight leading-none">
            {usdPrice(token.priceUsd)}
          </p>
        </div>
        <div className="card card-sm p-5">
          <span className="kicker">market cap</span>
          <p className="mt-1.5 text-[24px] font-extrabold tracking-tight leading-none">
            {usdCompact(token.marketCapUsd)}
          </p>
        </div>
        <div className="card card-sm p-5">
          <span className="kicker">volume</span>
          <p className="mt-1.5 text-[24px] font-extrabold tracking-tight leading-none">
            {usdCompact(token.volumeUsd)}
          </p>
        </div>
        <div className="card card-sm p-5">
          <span className="kicker">routed to cause</span>
          <p className="mt-1.5 text-[24px] font-extrabold tracking-tight leading-none text-rose-text">
            {usdCompact(routed)}
          </p>
        </div>
      </section>

      <SampleNote what="figures" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] items-start">
        <section className="card p-5 sm:p-7">
          <PriceChart series={series} label={`$${token.symbol}`} />

          <div className="mt-6">
            <div className="flex items-center justify-between text-[12px] font-bold uppercase tracking-kicker text-muted">
              <span>bonding curve</span>
              <span>{token.curvePct}% to graduation</span>
            </div>
            <span
              className="progress mt-2"
              style={{ "--fill": `${token.curvePct}%` } as React.CSSProperties}
            />
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              at 100% the curve graduates and liquidity moves to a pool. the cause split rides
              along — it is a property of the token, not of the venue.
            </p>
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          {/* the panel this whole site exists for */}
          <section className="card p-6">
            <span className="kicker">where the fees go</span>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-[15px] font-bold">{site.swapFeePct}% swap fee</span>
              <span className="flex-1 h-px bg-divider" />
              <span className="text-[15px] font-extrabold text-rose-text">
                {token.causeSharePct}%
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-card-sm bg-rose-soft/70 px-4 py-3">
              <CauseTile slug={token.cause} size={40} />
              <span className="text-[14px] font-bold text-rose-text leading-tight">
                {cause?.label ?? token.cause}
              </span>
            </div>

            <dl className="mt-5 space-y-2.5 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">splitter</dt>
                <dd className="font-semibold text-right">awaiting launch</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">settled payouts</dt>
                <dd className="font-semibold text-right">0</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">recipient</dt>
                <dd className="font-semibold text-right">
                  {cause?.orgs.length ? cause.orgs[0].name : "not named yet"}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-[12px] leading-relaxed text-subtle">
              the splitter has no owner and no withdraw. release() is external and unguarded, so
              anyone can push the balance to the recipient — including the recipient.
            </p>
          </section>

          <section className="card p-6">
            <span className="kicker">trade</span>
            <div className="mt-4 flex gap-2">
              <button type="button" className="btn-primary flex-1" aria-disabled="true" disabled>
                buy
              </button>
              <button type="button" className="btn-secondary flex-1" aria-disabled="true" disabled>
                sell
              </button>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-subtle">
              trading opens when the factory is deployed on {site.chain.name} and{" "}
              <code className="code-inline">NEXT_PUBLIC_GIVEPAD_FACTORY</code> is set. until then
              these buttons do nothing, on purpose.
            </p>
          </section>

          <section className="card p-6">
            <span className="kicker">facts</span>
            <dl className="mt-4 space-y-2.5 text-[13px]">
              {facts.map((f) => (
                <div key={f.k} className="flex justify-between gap-3">
                  <dt className="text-muted">{f.k}</dt>
                  <dd className="font-semibold text-right">{f.v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
