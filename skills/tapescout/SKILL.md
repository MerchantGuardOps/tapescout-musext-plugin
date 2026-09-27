---
name: tapescout
description: Check a token before trading it. Verdict (GREEN, ORANGE, RED, UNKNOWN) with the deciding reason, real holder concentration with pools excluded, insider networks, launch-wallet share, ticker copies and a quoted round-trip exit. Solana, BNB Chain, Robinhood Chain, Ethereum. Use before any swap.
---

# TapeScout

TapeScout answers one question before a trade: what am I looking at, and can I get out. It is information only, never advice, never custody. Verified is not safe.

## Rules for the agent

- Call `check_token` (MCP) or `GET /v1/check` (HTTP) with the token address before any swap, buy, or add.
- `RED` and `exit.status: "no_sell_route"` (NO EXIT) mean do not trade.
- `UNKNOWN` means a deciding read did not answer. Never treat it as zero risk.
- `ORANGE` means a material risk was found or a non-deciding read is missing; read `reason` and `reason_codes`.
- A result is fresh for 120 seconds (`expires_at`). Check again before acting on an old one.
- `unread_fields` lists what could not be measured. Absent evidence is never a number.

## Setup

Claude Code:

    claude mcp add --transport http tapescout https://api.tapescout.io/mcp --header "Authorization: Bearer YOUR_KEY"

Muse, ChatGPT, or any agent with custom connectors, send it:

    Add a custom connector with this OpenAPI schema: https://api.tapescout.io/openapi.json

and put the key in the credentials store, never in the chat.

Any HTTP client:

    GET https://api.tapescout.io/v1/check?address=MINT_OR_0x_ADDRESS
    Authorization: Bearer YOUR_KEY

Free tier, no key: add `owner=YOUR_WALLET_ADDRESS` for 5 checks a day. Errors are never charged.

Get a key: buy Pro at https://tapescout.io/#pricing, then send `/token` to @TapeScoutBot on Telegram.

## What comes back

    { "verdict": "ORANGE", "reason": "insider networks hold 5% of supply",
      "reason_codes": ["INSIDER_NETWORKS"],
      "exit": { "status": "ok", "cost_pct_10": 2.7, "cost_pct_25": 3.1 },
      "features": { "launch_pct": 0, "top10_pct": 23.2, "copycats": 2, "age_h": 0.5, "cap": 23703, "liq": 5844 },
      "coverage": { "reads_ok": 5, "reads_total": 6, "confidence": "MEDIUM" },
      "unread_fields": ["launch (history longer than 3,000 transactions)"],
      "expires_at": "2026-09-27T00:38:56Z", "chain": "solana" }

`top10_pct` and `top1_pct` exclude AMM, pool, and vault addresses. A raw top-holder number that includes the pool is wrong; the pool's share grows every time someone sells into it.

Reason codes: NO_EXIT, HONEYPOT_FLAGGED, RUGGED, LAUNCH_WALLET_SHARE, TOP1_CONCENTRATION, INSIDER_NETWORKS, MINT_AUTHORITY, ROUND_TRIP_OVER_GATE, LOW_LIQUIDITY, TOP10_CONCENTRATION, FREEZE_AUTHORITY, FOLLOWED_WALLET_SOLD, TOO_YOUNG, COPYCATS, NO_BUY_ROUTE, NO_MARKET_READ, DECIDING_READ_UNAVAILABLE, UNMEASURED_READS, NO_RULE_FIRED.

Full schema: https://api.tapescout.io/openapi.json
