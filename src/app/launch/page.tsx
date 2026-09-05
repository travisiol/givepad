import type { Metadata } from "next";
import Link from "next/link";
import { LaunchForm } from "@/components/LaunchForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "create",
  description: `launch a token on ${site.venue.name} with ${site.causeSharePct}% of its fees locked to a cause.`,
};

export default function LaunchPage() {
  return (
    <div className="pb-8">
      <header className="pt-8 pb-2">
        <span className="kicker">create</span>
        <h1 className="mt-4 [font-size:clamp(34px,5vw,56px)]">launch one that gives back.</h1>
        <p className="mt-5 max-w-2xl text-ink-60">
          the same flow as any {site.venue.name} launch, with one extra field. that field is the
          product: it becomes an immutable address in the constructor, so the giving cannot be
          turned off later — not by you, and not by us.{" "}
          <Link className="link" href="/docs">
            how the split works
          </Link>
          .
        </p>
      </header>

      <section className="mt-8">
        <LaunchForm />
      </section>
    </div>
  );
}
