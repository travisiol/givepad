import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { Reveal } from "@/components/Reveal";
import { contracts } from "@/lib/contracts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "docs",
  description: `how a ${site.name} launch routes its fees, and what is deployed.`,
};

const splitter = `// CauseSplitter.sol — the whole trust argument, in ~20 lines
contract CauseSplitter {
    address public immutable recipient;   // set once, in the constructor
    // no owner. no withdraw. no pause. no upgrade path.

    constructor(address _recipient) {
        require(_recipient != address(0), "no recipient");
        recipient = _recipient;
    }

    receive() external payable {}

    /// @notice unguarded on purpose: anyone can push the balance out,
    ///         including the recipient. the promise does not depend on us.
    function release() external {
        uint256 amount = address(this).balance;
        require(amount > 0, "nothing to release");
        (bool ok, ) = recipient.call{value: amount}("");
        require(ok, "transfer failed");
        emit Released(recipient, amount);
    }

    event Released(address indexed to, uint256 amount);
}`;

const apiSample = `curl ${site.url}/api/v1/tokens

{
  "live": false,
  "note": "no indexer configured; these are the example rows the site renders",
  "missing": "NEXT_PUBLIC_GIVEPAD_API",
  "tokens": [ … ]
}`;

const faqs = [
  {
    q: "is a token launched here a donation?",
    a: "no, and the site never says otherwise. buying a token is not a charitable gift, it is not tax deductible, and you should assume you can lose all of it. what is true is narrower and checkable: the swap fee stream of that token is routed to a splitter whose recipient cannot be changed.",
  },
  {
    q: `why does ${site.name} take nothing from the swap fee?`,
    a: `because a launchpad that takes a cut of a charity fee has to explain the cut on every page. the ${site.launchFeeEth} eth launch fee covers the deploy and the indexer; the swap fee goes to the cause at ${site.causeSharePct}%.`,
  },
  {
    q: "what stops a launcher pointing the split at their own wallet?",
    a: `nothing on ${site.venue.name} generally — which is exactly why the recipient here is not a free field. it is read from the on-chain registry by cause slug, and only ${site.partner.name} can append to that registry.`,
  },
  {
    q: "why is every counter zero?",
    a: "because nothing is deployed. a running donation total on a page like this is a fabricated donation, so the site total reads the indexer or reads zero. the tables carry an example set and say so in a line above the numbers.",
  },
  {
    q: "what happens when a cause has no verified organisation?",
    a: "the launch form refuses to submit. it is one of six interlocks, and it names itself rather than failing silently.",
  },
];

export default function DocsPage() {
  return (
    <div className="pb-8">
      <header className="pt-8">
        <span className="kicker">docs</span>
        <h1 className="mt-4 [font-size:clamp(34px,5vw,56px)]">how the split works.</h1>
        <p className="mt-5 max-w-2xl text-ink-60">
          short version: the cause is a constructor argument, the splitter has no owner, and the
          function that moves the money is open to anyone.
        </p>
      </header>

      <Reveal className="mt-12">
        <span className="kicker">
          <b>01</b> <i>/</i> the path a fee takes
        </span>
        <h2 className="mt-4 text-[28px]">four hops, no discretion in any of them.</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "swap", b: `a buy or sell on the ${site.venue.name} curve pays a ${site.swapFeePct}% fee.` },
            { n: "token", b: "the token forwards its fee share to the splitter named at deploy time." },
            { n: "splitter", b: "holds it. cannot spend it anywhere else — there is one address in it." },
            { n: "recipient", b: `the address ${site.partner.name} verified for that cause. anyone can call release().` },
          ].map((s, i) => (
            <li key={s.n} className="card card-sm p-6">
              <span className="kicker text-rose-text">0{i + 1}</span>
              <h3 className="mt-2 text-[19px]">{s.n}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-60">{s.b}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mt-16">
        <span className="kicker">
          <b>02</b> <i>/</i> the contract
        </span>
        <h2 className="mt-4 text-[28px]">written, reviewed, not deployed.</h2>
        <p className="mt-4 max-w-2xl text-ink-60">
          it is short on purpose. every line you remove from a contract holding charity money is a
          line that cannot be exploited or argued about.
        </p>
        <div className="mt-6">
          <CodeBlock code={splitter} />
        </div>

        <div className="mt-6 card overflow-hidden">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr>
                <th className="pl-5">contract</th>
                <th>what it does</th>
                <th className="text-right pr-5">address</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.key} className="trow">
                  <td className="pl-5 font-bold whitespace-nowrap">{c.label}</td>
                  <td className="text-[13px] text-ink-60">{c.blurb}</td>
                  <td className="text-right pr-5 whitespace-nowrap">
                    {c.address ? (
                      <code className="code-inline">{c.address}</code>
                    ) : (
                      <span className="badge badge-neutral">awaiting launch</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <span className="kicker">
          <b>03</b> <i>/</i> the chain trap
        </span>
        <div className="panel mt-4">
          <h2 className="text-[24px]">an address is not portable.</h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-60">
            the splitter pays on {site.chain.name} and cannot bridge. the donation address an
            organisation publishes is usually a custodial deposit address on ethereum mainnet, and
            reusing it here would send the money to a contract nobody controls — permanently.
            that is why a cause needs an address confirmed <em>on this chain</em>, in writing,
            before it can receive anything.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <span className="kicker">
          <b>04</b> <i>/</i> api
        </span>
        <h2 className="mt-4 text-[28px]">key-less, and honest about being empty.</h2>
        <p className="mt-4 max-w-2xl text-ink-60">
          three read endpoints and one write. the write returns <code className="code-inline">501</code>{" "}
          and names the missing environment variable rather than accepting a launch it cannot
          perform.
        </p>
        <div className="mt-6">
          <CodeBlock code={apiSample} />
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["GET /api/v1/tokens", "every token, newest first"],
            ["GET /api/v1/tokens/{address}", "one token, with its cause and split"],
            ["GET /api/v1/causes", "the registry, and which causes have a verified recipient"],
            ["POST /api/v1/launch", "deploy — 501 until the factory exists"],
          ].map(([route, blurb]) => (
            <li key={route} className="card card-sm p-4">
              <code className="code-inline">{route}</code>
              <span className="mt-2 block text-[13px] text-muted">{blurb}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-16">
        <span className="kicker">
          <b>05</b> <i>/</i> questions
        </span>
        <div className="mt-6 card divide-y divide-divider">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="cursor-pointer list-none font-bold text-[16px] flex items-center justify-between gap-4">
                {f.q}
                <span className="text-subtle text-[22px] leading-none group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-60">{f.a}</p>
            </details>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <div className="panel text-center">
          <h2 className="text-[28px]">still reading?</h2>
          <p className="mt-4 mx-auto max-w-lg text-ink-60">
            the registry is the part that needs people, not code.{" "}
            <Link className="link" href="/support">
              tell us which cause to open next
            </Link>
            .
          </p>
        </div>
      </Reveal>
    </div>
  );
}
