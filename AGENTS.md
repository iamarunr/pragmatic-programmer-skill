# Project Instructions

## Engineering Philosophy

For non-trivial software changes, use the `pragmatic-programmer` skill as the default engineering framework.

Prefer:
- Evidence over assumptions (inspect actual code, contracts, and runtime states before assuming).
- Small reversible changes over sweeping rewrites.
- Existing project conventions and dependencies before introducing new ones.
- Preservation of working behavior.
- Verification before declaring success.

Apply the rules silently. Surface only findings that materially affect the implementation, risk, architecture, scope, or user decisions.
