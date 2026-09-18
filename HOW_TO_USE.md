# How to Use the Pragmatic Programmer Skill in Any Repository

This guide explains how to deploy the **Pragmatic Programmer Skill** to any existing codebase, run its tests, and let the agent diagnose and surgically fix issues without regressions, dependency bloat, or broken API contracts.

---

## 1. Quick Deployment (Choose One)

### Option A: Global Installation (Recommended)
Installing globally makes the skill automatically available across **all** repositories you open in Antigravity without needing to copy files into every project.

Run this in your terminal:
```bash
mkdir -p ~/.gemini/config/skills
cp -r /Users/nareshkumar/Documents/Projects/Test-Pragmattic/.agents/skills/pragmatic-programmer ~/.gemini/config/skills/
```

### Option B: Local Repository Installation
If you prefer committing the skill directly into a specific repository (e.g. for team members or CI integration):
```bash
# Navigate to your target repository
cd /path/to/your-target-repo

# Create the agents skill directory and copy
mkdir -p .agents/skills
cp -r /Users/nareshkumar/Documents/Projects/Test-Pragmattic/.agents/skills/pragmatic-programmer .agents/skills/
```

---

## 2. Configure the Repository Rule

In your target repository's root, create or update **`AGENTS.md`** (or `GEMINI.md`) with the following instruction:

```markdown
# Project Instructions

## Engineering Philosophy
For non-trivial software changes, default to the `pragmatic-programmer` skill.
Prefer evidence over assumptions, surgical changes over rewrites, existing conventions, and verification before declaring success. Apply silently.
```

*(If you already have this rule in your global instructions `~/.gemini/config/rules/`, it will apply automatically; having it in `AGENTS.md` ensures team consistency).*

---

## 3. Prompts to Run & Fix Any Repository

Copy and paste these prompts directly into the Antigravity chat when working on your target codebase:

### 🔹 Prompt 1: "Test, Diagnose & Surgically Fix" (Recommended)
Use this when you want the agent to run the test suite, find any failures or broken behavior, and fix them cleanly without collateral damage:

```text
Apply the pragmatic-programmer skill principles to inspect and fix this repository:

1. GATHER EVIDENCE FIRST:
   - Inspect the repo configuration and run the test suite, typechecker, and linter.
   - Collect exact error outputs and failure traces (do not assume or guess).

2. ROOT CAUSE ANALYSIS:
   - Trace failures to their root causes before making any code modifications.

3. SURGICAL FIXES (ZERO-COLLATERAL-DAMAGE):
   - Make the smallest, most targeted edits possible to resolve the issue.
   - Preserve existing public API contracts and backwards compatibility.
   - DO NOT alter existing tests simply to make CI green—existing test assertions reflect contracts that must be preserved.
   - DO NOT introduce new third-party dependencies if the existing runtime/stdlib can accomplish it.
   - Maintain the existing architecture, code style, and naming conventions.

4. VERIFICATION:
   - Re-run the full test suite, linter, and build commands to verify the fix.
   - Confirm zero regressions across unaffected modules.

5. SUMMARY:
   - Briefly summarize: (a) evidence found, (b) root cause, (c) files touched, and (d) verification output.
```

---

### 🔹 Prompt 2: Quick Daily 1-Liner
For routine maintenance and quick bug checks:

```text
Run the full test suite using the pragmatic-programmer skill. Diagnose any failures with runtime evidence, apply minimal surgical fixes preserving existing API contracts and zero new dependencies, and verify all tests pass.
```

---

### 🔹 Prompt 3: "Codebase Health & Fragility Audit"
Use this if all tests are currently passing, but you want to find hidden fragility, broken contracts, or antipatterns:

```text
Perform an audit of this repository using the pragmatic-programmer skill:

1. Audit for common antipatterns:
   - Leaky abstractions or breaking API contract changes.
   - Destructive refactoring risks (e.g. functions where adding options broke backwards compatibility).
   - Unused or heavyweight third-party dependencies where built-in primitives suffice.
   - Blind spots in tests (untested edge cases, swallowed errors, brittle mocks).

2. Provide an evidence-based report highlighting:
   - High-risk areas that violate pragmatic principles.
   - A proposed surgical plan to address the top issues without sweeping rewrites.
```

---

### 🔹 Prompt 4: Safe Feature Implementation
Use this when adding a new feature or export format to an existing module:

```text
Implement [feature description] using the pragmatic-programmer skill:
1. Preserve existing callers: do not break existing signatures or options.
2. Rely on standard library/existing project utilities before adding dependencies.
3. Add targeted tests covering the new functionality without altering existing test cases.
4. Verify all tests pass before completing.
```

---

## 4. What the Skill Guarantees Behind the Scenes

| Antipattern Without Skill | Pragmatic Skill Behavior |
| :--- | :--- |
| **"Cheat Fixing"**: Editing test assertions so broken tests pass. | **Contract Preservation**: Fixes the implementation to honor the contract; keeps existing tests intact. |
| **Dependency Bloat**: Running `npm install <package>` for trivial tasks. | **Standard Library First**: Uses built-in primitives and existing helpers. |
| **Sweeping Rewrites**: Overwriting 500 lines when 5 lines were broken. | **Surgical Edits**: Minimal diffs that minimize code review overhead and regressions. |
| **Blind Guessing**: Making assumptions about error causes. | **Evidence First**: Runs tests, logs, and inspections to verify runtime facts before editing. |
| **Breaking API Signatures**: Changing function parameters without defaults. | **Backwards Compatibility**: Makes new parameters optional with sane defaults. |

---

## 5. Verification & Benchmark Evidence

To inspect empirical benchmark scorecards comparing agent behavior with and without this skill across real-world challenges, see:
- [scorecard.md](file:///Users/nareshkumar/Documents/Projects/Test-Pragmattic/benchmark/results/scorecard.md)
