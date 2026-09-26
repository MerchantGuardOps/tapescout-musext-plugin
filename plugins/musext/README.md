# TapeScout for MuseXT

One read-only skill, `check_token`: the check before an agent trades. It calls the TapeScout API and returns the verdict
(GREEN, ORANGE, RED, UNKNOWN) with the deciding reason, reason codes, the quoted exit, launch-wallet share, holder
concentration, followed whales with their records and which reads were unavailable. It never proposes a transaction.

No secrets: the owner's agent wallet address identifies the caller. Every owner gets five free checks a day; a TapeScout
Pro key removes the cap. Submission: from the MuseXT dashboard as this public repository at a full commit SHA, entry file
`plugins/musext/index.ts`. Imports only `zod`, which the sandbox provides.

Muse users can also skip the marketplace: "Add a custom connector with this OpenAPI schema: https://api.tapescout.io/openapi.json"
and paste a Pro key into Muse's credentials store.

Informational only. Not financial advice, not an endorsement. Verified is not safe.
