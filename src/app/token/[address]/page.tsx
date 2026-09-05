import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TokenView } from "@/components/TokenView";
import { findToken, priceSeries, seedTokens } from "@/lib/tokens";

type Params = { params: Promise<{ address: string }> };

export function generateStaticParams() {
  return seedTokens.map((t) => ({ address: t.address }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { address } = await params;
  const token = findToken(address);
  if (!token) return { title: "token not found" };
  return {
    title: `${token.name} ($${token.symbol})`,
    description: token.description,
  };
}

export default async function TokenPage({ params }: Params) {
  const { address } = await params;
  const token = findToken(address);
  if (!token) notFound();

  return <TokenView token={token} series={priceSeries(token)} />;
}
