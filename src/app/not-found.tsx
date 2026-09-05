import Link from "next/link";
import { BalloonCanvas } from "@/components/BalloonCanvas";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
      <BalloonCanvas text="404" />
      <h1 className="mt-10 [font-size:clamp(26px,4vw,40px)]">that one floated off.</h1>
      <p className="mt-4 max-w-md text-ink-60">
        no token, cause or page at this address.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link className="btn-primary" href="/">
          back to the board
        </Link>
        <Link className="btn-secondary" href="/causes">
          the registry
        </Link>
      </div>
    </div>
  );
}
