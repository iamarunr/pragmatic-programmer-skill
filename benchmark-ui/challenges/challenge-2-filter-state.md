# Challenge 2: Composite Tag Filter & Search (State Preservation & DOM Hygiene)

## Task
Implement search and multi-tag filtering on the workflow board:
1. Add an accessible search input and interactive tag filter pills (`#feature`, `#bug`, `#ops`) to the header.
2. When the user types or toggles a tag, filter the visible task cards across all columns in real-time.
3. **Architectural Constraint:** Filtering must NOT cause state amnesia or input focus thrashing:
   - When typing in the search box, focus must NOT be lost or reset on every keystroke.
   - Do not wipe out and recreate DOM event listeners unnecessarily.
   - Preserved cards must maintain their identities and drag-and-drop capabilities.
