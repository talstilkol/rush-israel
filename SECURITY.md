# Security Policy

## Product status

RUSH Israel is pre-release and owner-controlled. No released version currently
receives a public support guarantee.

## Reporting

Report vulnerabilities privately to the repository owner, `@talstilkol`.
Do not publish an active vulnerability, credential, token, private URL or
personal data in a public issue, PR, commit, log or screenshot.

## Secret handling

- Never commit secrets.
- Use environment variables or the authorised secret store.
- A removed secret must still be treated as exposed if it appeared in Git,
  build output, logs, artifacts or PR text.
- Rotate exposed credentials immediately.
- Do not rewrite Git history unless the owner explicitly authorises an incident
  response and the consequences have been assessed.

## Security acceptance

A PR is blocked when it introduces or fails to resolve:

- a credential or private key;
- production debug controls;
- an unauthorised external origin;
- an unreviewed dependency or binary;
- unsafe persistence or migration behaviour;
- unresolved high-severity security findings.

The comprehensive production-security unit is `RSH-024`.
