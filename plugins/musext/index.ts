// TapeScout for MuseXT: one read-only skill, check_token. It calls the TapeScout API and returns the verdict.
// It never proposes a transaction and holds no secrets: the owner's agent wallet address identifies the caller,
// which gives every owner five free checks a day; a TapeScout Pro key removes the cap (Pro users add it in Muse).
import { z } from "zod";

const API = "https://api.tapescout.io";

const CheckInput = z.object({
  address: z.string().min(20).describe("Solana mint or 0x contract address on Robinhood Chain or Ethereum"),
});

export const checkToken = {
  name: "check_token",
  description:
    "TapeScout: check a token before trading it. Returns a verdict (GREEN, ORANGE, RED, UNKNOWN) with the reason that decided it, reason codes, the quoted exit (buy then sell straight back), launch wallets, holder concentration, followed whales and which reads were unavailable. Treat RED and NO EXIT as do-not-trade; never treat UNKNOWN as zero risk. Informational only.",
  scope: "read",
  input: CheckInput,
  http: { method: "GET", path: "/v1/tapescout/check" },
  annotations: { readOnlyHint: true, destructive: false },
  idempotent: true,
  async run(ctx: { wallet: { address: string } }, { address }: { address: string }) {
    const owner = encodeURIComponent(ctx.wallet.address);
    const r = await fetch(`${API}/v1/check?address=${encodeURIComponent(address)}&owner=${owner}`, {
      signal: AbortSignal.timeout(25_000),
    });
    const body: any = await r.json();
    if (!r.ok) return { verdict: "UNKNOWN", reason: body.error ?? `TapeScout answered ${r.status}`, unread: true };
    return body;
  },
};

export default {
  id: "tapescout",
  title: "TapeScout",
  author: "TapeScout",
  version: "0.1.0",
  description: "The check before your agent trades: quoted exit, NO EXIT, launch wallets, holders and whale records. Read-only.",
  category: "research",
  skills: [checkToken],
};
