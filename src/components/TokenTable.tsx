import Link from "next/link";
import { causeLabel } from "@/lib/causes";
import { feesToCause } from "@/lib/given";
import { usdCompact, usdPrice } from "@/lib/format";
import { ageLabel, type Token } from "@/lib/tokens";
import { CauseChip } from "./CauseTile";

/**
 * The market table.
 *
 * The column that matters is "to cause" — what this token's volume has routed
 * at its written split. It is computed here rather than stored on the row, so
 * it can never drift into looking like a settled figure someone recorded.
 */
export function TokenTable({ tokens, showCause = true }: { tokens: Token[]; showCause?: boolean }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr>
              <th className="pl-5">token</th>
              {showCause && <th>cause</th>}
              <th className="text-right">price</th>
              <th className="text-right">mcap</th>
              <th className="text-right">to cause</th>
              <th className="w-[150px]">curve</th>
              <th className="text-right pr-5">age</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.address} className="trow">
                <td className="pl-5">
                  <Link href={`/token/${t.address}`} className="flex items-center gap-3 group">
                    <CauseChip slug={t.cause} />
                    <span className="min-w-0">
                      <span className="block font-bold leading-tight truncate group-hover:text-rose-text transition-colors">
                        {t.name}
                      </span>
                      <span className="block text-[12px] font-semibold text-muted leading-tight">
                        ${t.symbol} · {t.pair}
                      </span>
                    </span>
                  </Link>
                </td>

                {showCause && (
                  <td>
                    <Link
                      href={`/causes/${t.cause}`}
                      className="text-[13px] font-semibold text-muted hover:text-primary transition-colors"
                    >
                      {causeLabel(t.cause)}
                    </Link>
                  </td>
                )}

                <td className="text-right font-semibold">{usdPrice(t.priceUsd)}</td>
                <td className="text-right font-semibold">{usdCompact(t.marketCapUsd)}</td>
                <td className="text-right font-bold text-rose-text">
                  {usdCompact(feesToCause(t.volumeUsd))}
                </td>

                <td>
                  <span className="progress" style={{ "--fill": `${t.curvePct}%` } as React.CSSProperties} />
                  <span className="mt-1.5 block text-[11px] font-bold text-subtle">
                    {t.curvePct}% to graduation
                  </span>
                </td>

                <td className="text-right pr-5 text-[13px] font-semibold text-muted">
                  {ageLabel(t.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
