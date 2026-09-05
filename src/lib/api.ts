import { NextResponse } from "next/server";

/** the api is advertised as key-less and callable from any frontend */
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS });
}

/**
 * The honest 501. An endpoint that depends on a service nobody has configured
 * says which environment variable is missing rather than inventing an answer.
 */
export function notConfigured(what: string, envVar: string) {
  return json(
    {
      error: "not_configured",
      message: `${what} is not configured on this deployment.`,
      missing: envVar,
    },
    501
  );
}

export function preflight() {
  return new Response(null, { status: 204, headers: CORS });
}
