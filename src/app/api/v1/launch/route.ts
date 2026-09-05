import { notConfigured, preflight } from "@/lib/api";

export function OPTIONS() {
  return preflight();
}

/**
 * Deploying a token needs a factory. There isn't one, so this says which
 * variable is missing rather than accepting a launch it cannot perform and
 * handing back an id nobody can resolve.
 */
export function POST() {
  return notConfigured("the launch factory", "NEXT_PUBLIC_GIVEPAD_FACTORY");
}

export function GET() {
  return notConfigured("the launch factory", "NEXT_PUBLIC_GIVEPAD_FACTORY");
}
