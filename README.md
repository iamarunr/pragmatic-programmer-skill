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

## Pro-Tips for Getting the Most Out of This Skill

Here is my recommendation for how to get the most out of this skill throughout an entire project:

### 1. The "Kickoff" Prompt
At the very beginning of a new project or major architectural change, you should use an Activation Prompt. This sets the ground rules immediately.

You can tell the AI:

> "We are about to design a new system. I want you to adopt the persona defined in `SKILL.md`. At every major step—especially when choosing dependencies, designing abstractions, or handling state—you must apply the Decision-Time Checks from the skill. If you see us violating Orthogonality or DRY, stop me."

### 2. Trust the "Quick Self-Check"
You might have noticed that at the very bottom of `SKILL.md`, there is a section called "Quick Self-Check Before Responding."

This is secretly the most powerful part of the file for an AI agent! Because it's at the end of the file, it sits fresh in the AI's "working memory." It instructs the AI to automatically run 5 high-leverage questions (Orthogonality, DRY, Reversibility, Broken Windows, Coincidence) on any non-trivial change before it even replies to you.

So, just by loading the skill, the AI is already primed to self-audit at every step.

### 3. Pacing: When to Lean In Heavily
If you force the AI to write out an essay on every principle for every line of code, it will become exhausting to read. My recommendation is to explicitly invoke the skill heavily during these three specific phases:

* **System Design Phase:** Ask the AI: *"Before we write code, evaluate this architecture against the ETC (Easier to Change) and Reversibility principles in `SKILL.md`."*
* **When Debugging a Weird Issue:** Ask the AI: *"I'm stuck. Please apply the 'Before debugging' checks from `SKILL.md` and act as my rubber duck."*
* **Before Committing/Merging:** Ask the AI: *"Do a final review of the files we just changed using the Anti-Patterns list in `SKILL.md`."*

By setting the rule at the beginning and explicitly calling it out during critical transitions, you'll ensure the AI stays strictly pragmatic without slowing down your workflow!
