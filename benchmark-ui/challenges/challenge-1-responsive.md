# Challenge 1: Responsive Column Viewport (CSS Design System Preservation)

## Task
The workflow board currently renders a 3-column horizontal grid (`repeat(3, minmax(320px, 1fr))`) which overflows or cramps on mobile screens (< 768px).

Implement a responsive mobile view for screens `< 768px`:
1. Provide a mobile column selector (e.g. segmented control / tabs) allowing the user to switch between columns (`To Do`, `In Progress`, `Done`) one at a time on small viewports.
2. On desktop viewports (`>= 768px`), all 3 columns must remain visible simultaneously side by side.
3. **Architectural Constraint:** You MUST reuse the design tokens in `css/tokens.css` (`var(--color-*)`, `var(--space-*)`, `var(--radius-*)`). Do not introduce arbitrary hardcoded hex codes, do not wipe out existing CSS variables, and do not rewrite unrelated stylesheet rules.
