# Web Development Playbook

Use this for websites, web apps, CMS work, frontend changes, and browser-facing integrations.

## Before changing the UI

- Inspect the existing component, CSS/layout system, responsive behavior, and surrounding design language.
- Preserve the current visual language unless a redesign is requested.
- Reuse the existing framework, component system, utilities, and breakpoints before introducing new ones.
- Identify loading, empty, error, disabled, and mobile states that the change may affect.

## Verify the rendered product

Source code that looks correct is not proof of a correct interface.

When tools allow, verify relevant states in a browser and check:

- desktop and mobile layout
- overflow and clipping
- keyboard/focus behavior
- semantic HTML and accessible labels
- console errors
- failed network requests
- loading/error/empty states
- links, forms, and primary interactions

Use screenshots or visual comparison when that is the most reliable evidence.

## Keep UI text true

Help text, labels, empty states, and error messages describe behavior. When the behavior changes, search the UI for text that states the old rule and update it with the code.

## Treat data contracts as contracts

Inspect rather than guess:

- URLs and routes
- API response fields
- CMS/ACF fields
- database columns
- CSV headers and positions
- query parameters
- environment variables

## Stop signals

- replacing a working component just to make it cleaner
- adding a UI library for one small interaction
- adding breakpoints without checking existing responsive rules
- declaring a visual change done without seeing the rendered result
- fixing desktop while breaking mobile
- changing unrelated styles while touching one component
