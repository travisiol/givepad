import Link from "next/link";
import { Balloon } from "@/components/Balloon";
import { CauseTile } from "@/components/CauseTile";
import { GivenCounter, SampleNote } from "@/components/Given";
import { Reveal } from "@/components/Reveal";
import { TokenTable } from "@/components/TokenTable";
import { causes } from "@/lib/causes";
import { site } from "@/lib/site";
import { seedTokens } from "@/lib/tokens";

/** the causes drifting around the wordmark */
const heroTiles = [
  { slug: "clean-water", cls: "left-[3%] top-[10%]", rot: -8, dur: 7, delay: 0, blur: 0, size: 148 },
  { slug: "pediatric-cancer", cls: "right-[5%] top-[8%]", rot: 6, dur: 8, delay: -2, blur: 0, size: 128 },
  { slug: "food-security", cls: "left-[10%] bottom-[16%]", rot: 5, dur: 6.5, delay: -4, blur: 0, size: 108 },
  { slug: "reforestation", cls: "right-[9%] bottom-[20%]", rot: -6, dur: 7.5, delay: -1, blur: 0, size: 118 },
  { slug: "animal-rescue", cls: "right-[24%] top-[2%]", rot: -5, dur: 7.2, delay: -2.5, blur: 0, size: 126 },
  { slug: "education", cls: "left-[1%] top-[50%] hidden lg:block", rot: 10, dur: 9, delay: -3, blur: 1.2, size: 96 },
  { slug: "shelter", cls: "right-[1%] top-[48%] hidden lg:block", rot: -9, dur: 6, delay: -5, blur: 1.5, size: 88 },
  { slug: "open-source", cls: "left-[26%] bottom-[2%] hidden md:block", rot: 4, dur: 8.5, delay: -6, blur: 2, size: 76 },
  { slug: "disaster-relief", cls: "left-[22%] top-[3%] hidden md:block", rot: -4, dur: 7.8, delay: -1.5, blur: 1.8, size: 80 },
  { slug: "mental-health", cls: "right-[28%] bottom-[4%] hidden md:block", rot: 6, dur: 8.2, delay: -3.5, blur: 2.2, size: 72 },
];

const steps = [
  {
    n: "01",
    title: "pick a cause",
    body: `ten of them, from clean water to open source. the pick is a field in the deploy transaction, not a promise in a bio — and ${site.partner.name} holds the address on the other side.`,
  },
  {
    n: "02",
    title: "launch the token",
    body: `name it, pick a ticker, drop an image. it goes live on a ${site.venue.name} bonding curve in one transaction, for ${site.launchFeeEth} eth.`,
  },
  {
    n: "03",
    title: "the fees leave on their own",
    body: "every swap pays the cause's splitter. it has no owner and no withdraw, and release() is open to anyone — so the money moving does not depend on us being around.",
  },
];

export default function Home() {
  return (
    <div className="pb-8">
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center py-16 sm:py-20">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {heroTiles.map((t) => (
            <span
              key={t.slug}
              className={`tile ${t.cls}`}
              style={
                {
                  "--rot": `${t.rot}deg`,
                  "--dur": `${t.dur}s`,
                  "--delay": `${t.delay}s`,
                  "--blur": `${t.blur}px`,
                  width: t.size,
                  height: t.size,
                } as React.CSSProperties
              }
            >
              <CauseTile slug={t.slug} size={t.size} />
            </span>
          ))}
        </div>

        <div className="relative animate-fade-up">
          <span className="kicker relative z-[2]">
            {site.venue.label} · {site.chain.name} · powered by {site.partner.name}
          </span>

          <div className="mt-8 flex justify-center">
            <Balloon />
          </div>

          <h1 className="hero-h1 mt-10 max-w-4xl mx-auto [font-size:clamp(38px,5.6vw,68px)]">
            every launch <span className="accent-word">gives back</span>.
          </h1>

          <p className="mt-6 mx-auto max-w-xl text-[17px] sm:text-[18px] leading-relaxed text-ink-60">
            launch a token on {site.venue.name} and lock {site.causeSharePct}% of its fees to a
            cause. the split is written at deploy time, lives in the contract, and nobody — you,
            us, or the buyer — can move it afterwards.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link className="btn-primary" href="/launch">
              start a launch
            </Link>
            <a className="btn-secondary" href="#how">
              how it works
            </a>
          </div>
        </div>
      </section>

      <Reveal className="pt-2">
        <GivenCounter className="max-w-2xl mx-auto" />
      </Reveal>

      <Reveal id="how" className="section scroll-mt-16">
        <span className="kicker">
          <b>01</b> <i>/</i> how it works
        </span>
        <h2 className="mt-4">three steps, and then it runs without you.</h2>
        <p className="mt-4 max-w-xl text-ink-60">
          the whole product is one idea: make the giving part of the deploy, so it cannot be
          quietly dropped later.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card card-sm p-7">
              <span className="kicker text-rose-text">{s.n}</span>
              <h3 className="mt-3 text-[22px]">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-60">{s.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal id="market" className="section pt-0 scroll-mt-16">
        <span className="kicker">
          <b>02</b> <i>/</i> the board
        </span>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h2>every token here pays a cause.</h2>
          {!site.isLive && <span className="badge badge-neutral">awaiting launch</span>}
        </div>
        <SampleNote />
        <div className="mt-8">
          <TokenTable tokens={seedTokens.slice(0, 8)} />
        </div>
        <div className="mt-6">
          <Link className="btn-secondary" href="/tokens">
            all {seedTokens.length} tokens
          </Link>
        </div>
      </Reveal>

      <Reveal id="causes" className="section pt-0 scroll-mt-16">
        <span className="kicker">
          <b>03</b> <i>/</i> the registry
        </span>
        <h2 className="mt-4">ten causes. no borrowed names.</h2>
        <p className="mt-4 max-w-2xl text-ink-60">
          a launcher picks a cause, not an organisation. {site.partner.name} does the diligence and
          holds the payout address — so nobody&rsquo;s logo ends up on a token they never agreed
          to.{" "}
          <Link className="link" href="/causes">
            read the registry
          </Link>
          .
        </p>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {causes.map((c) => (
            <Link
              key={c.slug}
              href={`/causes/${c.slug}`}
              className="card card-sm p-5 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform"
            >
              <CauseTile slug={c.slug} size={72} />
              <span className="text-[13px] font-bold leading-tight">{c.label}</span>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal className="section pt-0">
        <div className="panel text-center">
          <h2 className="[font-size:clamp(28px,4vw,44px)]">
            the split is the first thing you set.
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-ink-60">
            not a pledge in the docs, not a multisig that means well. one immutable address in the
            constructor, and a release function anyone can call.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link className="btn-primary" href="/launch">
              start a launch
            </Link>
            <Link className="btn-secondary" href="/docs">
              read the docs
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
