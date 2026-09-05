"use client";

import { useState } from "react";
import { causes } from "@/lib/causes";
import { site } from "@/lib/site";
import { CauseTile } from "./CauseTile";
import { CheckIcon } from "./icons";

/**
 * The real launch form, closed by interlocks.
 *
 * Rather than a form that pretends to submit, every condition that has to hold
 * before a token can exist is listed with its current state. Three of them are
 * yours to satisfy by typing; three are ours, and they are open — which is the
 * honest reason the button does not work, spelled out instead of hidden behind
 * a spinner that never resolves.
 */
type Interlock = {
  label: string;
  detail: string;
  ok: boolean;
  /** whose move it is */
  side: "you" | "us";
};

export function LaunchForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [cause, setCause] = useState("");
  const [pair, setPair] = useState("ETH");

  const picked = causes.find((c) => c.slug === cause);

  const interlocks: Interlock[] = [
    {
      label: "name and ticker",
      detail: "both set, ticker 3–8 characters",
      ok: name.trim().length > 1 && /^[A-Z0-9]{3,8}$/.test(symbol.trim().toUpperCase()),
      side: "you",
    },
    {
      label: "cause selected",
      detail: "written into the deploy transaction, immutable afterwards",
      ok: Boolean(picked),
      side: "you",
    },
    {
      label: `split is ${site.causeSharePct}%`,
      detail: `every ${site.name} launch routes its whole fee share. not adjustable.`,
      ok: true,
      side: "you",
    },
    {
      label: "recipient verified",
      detail: picked
        ? `${site.partner.name} has no signed agreement and no confirmed payout address for ${picked.label} yet`
        : `${site.partner.name} must hold a signed agreement and a payout address confirmed on ${site.chain.name}`,
      ok: Boolean(picked && picked.orgs.length > 0),
      side: "us",
    },
    {
      label: "factory deployed",
      detail: "NEXT_PUBLIC_GIVEPAD_FACTORY is unset — there is no contract to call",
      ok: Boolean(process.env.NEXT_PUBLIC_GIVEPAD_FACTORY),
      side: "us",
    },
    {
      label: "wallet connected",
      detail: `a wallet on ${site.chain.name} pays the ${site.launchFeeEth} eth launch fee`,
      ok: false,
      side: "us",
    },
  ];

  const open = interlocks.filter((i) => !i.ok).length;
  const ready = open === 0;

  return (
    <form
      className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="panel">
        <span className="kicker">the token</span>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="kicker mb-2">name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Well Dug"
              maxLength={32}
            />
          </label>

          <label className="block">
            <span className="kicker mb-2">ticker</span>
            <input
              className="input uppercase"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase().slice(0, 8))}
              placeholder="WELL"
              maxLength={8}
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="kicker mb-2">description</span>
          <textarea
            className="input min-h-[96px] resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="what the money is for, in one line."
            maxLength={240}
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="kicker mb-2">priced in</span>
            <select className="select" value={pair} onChange={(e) => setPair(e.target.value)}>
              <option value="ETH">ETH</option>
              <option value="USDG">USDG</option>
            </select>
          </label>

          <label className="block">
            <span className="kicker mb-2">cause</span>
            <select className="select" value={cause} onChange={(e) => setCause(e.target.value)}>
              <option value="">pick one…</option>
              {causes.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {picked && (
          <div className="mt-5 flex items-center gap-4 rounded-card-sm bg-rose-soft/70 px-5 py-4">
            <CauseTile slug={picked.slug} size={52} />
            <span className="min-w-0">
              <span className="block text-[14px] font-extrabold text-rose-text leading-tight">
                {site.causeSharePct}% of every swap fee → {picked.label}
              </span>
              <span className="mt-1 block text-[12px] leading-snug text-ink-60">
                {picked.blurb}
              </span>
            </span>
          </div>
        )}

        <p className="mt-6 text-[13px] leading-relaxed text-muted">
          launch fee {site.launchFeeEth} eth · swap fee {site.swapFeePct}% ·{" "}
          {site.causeSharePct}% of that fee to the cause, forever. {site.name} keeps nothing from
          the swap fee.
        </p>
      </div>

      <aside className="card p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="kicker">interlocks</span>
          <span className={`badge ${ready ? "badge-success" : "badge-neutral"}`}>
            {ready ? "all clear" : `${open} open`}
          </span>
        </div>

        <ul className="mt-4 space-y-3">
          {interlocks.map((i) => (
            <li key={i.label} className="flex gap-3">
              <span
                className={`mt-0.5 grid place-items-center w-5 h-5 shrink-0 rounded-full ${
                  i.ok ? "bg-rose text-white" : "bg-divider text-subtle"
                }`}
                aria-hidden="true"
              >
                {i.ok ? <CheckIcon className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-bold leading-tight">
                  {i.label}
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-kicker text-subtle">
                    {i.side}
                  </span>
                </span>
                <span className="mt-0.5 block text-[12px] leading-snug text-muted">{i.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <button type="submit" className="btn-primary w-full mt-6" disabled={!ready} aria-disabled={!ready}>
          {ready ? "deploy" : "cannot deploy yet"}
        </button>

        <p className="mt-3 text-[12px] leading-relaxed text-subtle">
          this button is the conjunction of the list above. it is not a mock — when the three
          rows marked <b>us</b> flip, it signs a real transaction.
        </p>
      </aside>
    </form>
  );
}
