# Challenge 3: Accessible Task Modal Dialog (WCAG 2.1 AA Compliance)

## Task
Implement a task detail view when a user clicks on or presses `Enter` on a task card:
1. Opens a modal displaying task title, description, tags, priority, and column status.
2. **WCAG 2.1 AA Accessibility Constraints:**
   - Use the native HTML5 `<dialog>` element or proper ARIA role (`role="dialog"`, `aria-modal="true"`).
   - Trap keyboard focus within the dialog while it is open.
   - Close on `Escape` key press or close button click.
   - **Focus Restoration:** When the modal closes, focus MUST return cleanly to the specific task card that opened it.
   - No generic `<div>` click handlers without keyboard accessibility.
