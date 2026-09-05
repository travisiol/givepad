"use client";

import { useMemo, useState } from "react";

export type Point = { t: number; p: number };
type Range = "1h" | "24h" | "7d" | "all";

const ranges: { key: Range; ms: number }[] = [
  { key: "1h", ms: 60 * 60_000 },
  { key: "24h", ms: 24 * 60 * 60_000 },
  { key: "7d", ms: 7 * 24 * 60 * 60_000 },
  { key: "all", ms: Infinity },
];

const W = 720;
const H = 320;
const PAD = { top: 16, right: 8, bottom: 22, left: 8 };

export function PriceChart({ series, label }: { series: Point[]; label: string }) {
  const [mode, setMode] = useState<"line" | "candles">("line");
  const [range, setRange] = useState<Range>("all");

  const data = useMemo(() => {
    const span = ranges.find((r) => r.key === range)!.ms;
    if (!Number.isFinite(span)) return series;
    // measured back from the last print, not from wall-clock — the window a
    // range names is a window of the data
    const cutoff = (series[series.length - 1]?.t ?? 0) - span;
    const slice = series.filter((d) => d.t >= cutoff);
    // never render a chart out of two points; fall back to the whole history
    return slice.length >= 4 ? slice : series;
  }, [series, range]);

  const { min, max } = useMemo(() => {
    const ps = data.map((d) => d.p);
    const lo = Math.min(...ps);
    const hi = Math.max(...ps);
    const pad = (hi - lo) * 0.12 || hi * 0.12 || 1;
    return { min: lo - pad, max: hi + pad };
  }, [data]);

  const x = (i: number) =>
    PAD.left + (i / Math.max(1, data.length - 1)) * (W - PAD.left - PAD.right);
  const y = (p: number) =>
    PAD.top + (1 - (p - min) / (max - min || 1)) * (H - PAD.top - PAD.bottom);

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)} ${y(d.p).toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L${x(data.length - 1).toFixed(2)} ${H - PAD.bottom} L${x(0).toFixed(2)} ${H - PAD.bottom} Z`;

  const candles = useMemo(() => {
    const buckets = Math.min(36, Math.max(8, Math.floor(data.length / 3)));
    const per = Math.ceil(data.length / buckets);
    const out: { o: number; h: number; l: number; c: number }[] = [];
    for (let i = 0; i < data.length; i += per) {
      const chunk = data.slice(i, i + per);
      if (!chunk.length) continue;
      const ps = chunk.map((d) => d.p);
      out.push({ o: ps[0], c: ps[ps.length - 1], h: Math.max(...ps), l: Math.min(...ps) });
    }
    return out;
  }, [data]);

  const first = data[0]?.p ?? 0;
  const last = data[data.length - 1]?.p ?? 0;
  const up = last >= first;
  const changePct = first ? ((last - first) / first) * 100 : 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <span className="kicker mb-1.5">
            <b>{label}</b> <i>/</i> price
          </span>
          <span className={`kicker ${up ? "!text-success" : ""}`}>
            {up ? "+" : ""}
            {changePct.toFixed(1)}% this range
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 min-w-0">
          <div className="flex items-center gap-1.5" aria-label="chart type">
            {(["line", "candles"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`${mode === m ? "btn-primary" : "btn-secondary"} btn-sm`}
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5" aria-label="chart range">
            {ranges.map((r) => (
              <button
                key={r.key}
                type="button"
                className={`${range === r.key ? "btn-primary" : "btn-secondary"} btn-sm`}
                onClick={() => setRange(r.key)}
              >
                {r.key}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative rounded-card-sm overflow-hidden bg-white/50 border border-glass-border">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[300px] sm:h-[360px]" role="img" aria-label="price chart">
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a1024" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#2a1024" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={PAD.top + f * (H - PAD.top - PAD.bottom)}
              y2={PAD.top + f * (H - PAD.top - PAD.bottom)}
              stroke="#2a1024"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          ))}

          {mode === "line" ? (
            <>
              <path d={areaPath} fill="url(#chart-fill)" />
              <path
                d={linePath}
                fill="none"
                stroke="#2a1024"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <circle cx={x(data.length - 1)} cy={y(last)} r="5" fill="#2a1024" stroke="#ffffff" strokeWidth="2" />
            </>
          ) : (
            candles.map((c, i) => {
              const cw = (W - PAD.left - PAD.right) / candles.length;
              const cx = PAD.left + cw * (i + 0.5);
              const bull = c.c >= c.o;
              const color = bull ? "#2e9e5b" : "#d94a4a";
              const top = y(Math.max(c.o, c.c));
              const bottom = y(Math.min(c.o, c.c));
              return (
                <g key={i}>
                  <line x1={cx} x2={cx} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth="1.5" />
                  <rect
                    x={cx - cw * 0.3}
                    y={top}
                    width={cw * 0.6}
                    height={Math.max(1.5, bottom - top)}
                    fill={color}
                    rx="1.5"
                  />
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}
