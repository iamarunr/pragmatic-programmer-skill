# Pragmatic Programmer AI Skill

This repository contains a custom AI skill designed to bring the principles of *The Pragmatic Programmer* (by Andy Hunt and Dave Thomas) to your AI coding assistants. 

By applying these instructions, your AI will favor easy-to-change designs, evidence over assumption, and small reversible steps over heroic guesses.

## How to use

You can use the `SKILL.md` file to instruct almost any AI coding agent. Here is how you can use it across different platforms:

- **Cursor / GitHub Copilot / IDE Agents:** Copy the contents of `SKILL.md` into your `.cursorrules` file, or add it to your workspace-level custom instructions.
- **Claude (Project Knowledge):** Upload `SKILL.md` to your Claude Project's knowledge base or add it to your custom system instructions.
- **ChatGPT (Custom GPTs):** Paste the contents of `SKILL.md` into the "Instructions" field of your Custom GPT.
- **Antigravity:** Drop the `SKILL.md` file into your `.gemini/skills/` directory to have it automatically apply to your sessions.

## Key Concepts & Best Practices

When you use this skill, the AI is instructed to evaluate your code against the following core heuristics from the book:

* **ETC (Easier to Change):** When two designs both work, the AI will prefer the one that costs less to rip out, swap, or rename.
* **DRY (Don't Repeat Yourself):** DRY is about knowledge, not characters. The AI will hunt for duplicated domain knowledge or intent, rather than just visually similar code.
* **Orthogonality:** Components should not leak into each other. The AI will design independent, self-contained components with a single, well-defined purpose.
* **Reversibility:** There are no final decisions. The AI will encourage hiding third-party APIs behind abstraction layers so they can be easily swapped out later.
* **Fix Broken Windows:** The AI will refuse to walk past rot silently. Misleading names, dead branches, and hidden TODOs will be flagged and fixed.
* **Tracer Bullets over Big-Bang Integration:** The AI will suggest building a thin, working, end-to-end path through every layer first, providing immediate feedback under actual conditions.
* **Don't Program by Coincidence:** The AI will be "allergic to mystery." If a bug disappears but the root cause is unknown, the AI will force an investigation rather than celebrating an accidental success.
* **Crash Early (Pragmatic Paranoia):** The AI will plan for failure, advocating for assertions and early crashes rather than letting a crippled program continue and corrupt data.
* **Tell, Don't Ask:** The AI will decouple code by ensuring objects tell other objects what to do, rather than querying their internal state to make decisions.
