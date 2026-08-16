# Security Playbook

Use this for authentication, authorization, secrets, sessions, sensitive data, validation, permissions, and security-sensitive integrations.

## Defaults

- Minimize attack surface.
- Grant the least privilege needed.
- Validate untrusted input at boundaries.
- Use established, maintained security primitives.
- Keep secrets out of source, logs, URLs, and client-visible bundles.
- Fail safely when authorization or validation is uncertain.

## Do not invent

Do not roll custom cryptography, password hashing, authentication protocols, session mechanisms, CSRF protection, token formats, or sanitizers when established solutions exist.

## Before shipping

- Verify authorization, not just authentication.
- Check error messages and logs for sensitive leakage.
- Check dependency and framework guidance for the actual installed version.
- Consider replay, duplicate submission, privilege escalation, and insecure defaults where relevant.
- Prefer short-lived credentials and explicit rotation paths.

Security is a constraint on the design, not cleanup performed at the end.
