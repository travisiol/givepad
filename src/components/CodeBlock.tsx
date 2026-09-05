"use client";

import { useState } from "react";

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked — the text is selectable either way
    }
  }

  return (
    <div className="relative">
      <pre className="code-block p-4 pr-28 sm:p-5 sm:pr-28">{code}</pre>
      <button type="button" className="btn-secondary btn-sm absolute top-3 right-3" onClick={copy}>
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
