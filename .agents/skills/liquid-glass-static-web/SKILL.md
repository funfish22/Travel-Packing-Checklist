---
name: liquid-glass-static-web
description: Design, build, or restyle polished Apple-informed liquid-glass web interfaces using only static HTML, CSS, and optional vanilla JavaScript. Use for landing pages, utilities, dashboards, forms, cards, grouped toolbars, tab navigation, menus, modals, or existing no-framework websites that need translucent functional layers, responsive behavior, accessibility, and graceful fallbacks without React, Vue, Tailwind, npm, bundlers, or other frameworks.
---

# Liquid Glass Static Web

Create refined liquid-glass interfaces with semantic HTML, native CSS, and only the JavaScript required for behavior.

## Workflow

1. Inspect the existing HTML, CSS, JavaScript, assets, and user-visible behavior.
2. Preserve IDs, form semantics, event hooks, storage keys, and working interactions unless the request explicitly changes them.
3. Establish visual depth before adding glass:
   - Use a restrained gradient, image, or softly blurred color fields behind the interface.
   - Keep the page background quieter than the interactive content.
4. Define reusable design tokens in `:root` for color, transparency, blur, borders, shadows, radii, spacing, and motion.
5. Apply glass to a small hierarchy of meaningful surfaces:
   - Primary shell or floating navigation
   - Grouped toolbars, controls, menus, and modals
   - Active or selected elements
6. Add edge highlights, inner light, and shadows subtly. Avoid making every element equally translucent.
7. Verify responsive layout, keyboard focus, text contrast, reduced motion, and unsupported-browser fallbacks.
8. Test the static page directly without introducing a build step.

## Implementation Rules

- Use valid semantic HTML and native browser APIs.
- Do not add frameworks, package managers, component libraries, preprocessors, or build tooling.
- Prefer CSS classes and custom properties over repeated inline styles.
- Use `backdrop-filter` and `-webkit-backdrop-filter` together.
- Pair translucent backgrounds with a more opaque fallback before any `@supports` enhancement.
- Keep body text on sufficiently opaque surfaces; decorative transparency must not reduce readability.
- Use no more than three glass elevations in one view.
- Reserve stronger blur, shine, and saturation for focused or active surfaces.
- Keep border highlights translucent and shadows soft. Avoid neon outlines and excessive glow unless requested.
- Make controls visibly interactive in default, hover, active, focus-visible, and disabled states.
- Keep animation brief and functional. Disable or simplify it under `prefers-reduced-motion: reduce`.
- Avoid remote dependencies when an inline SVG, CSS shape, system font, or existing local asset is sufficient.
- Treat Liquid Glass as a topmost functional layer for controls and navigation, not as content decoration.
- Group toolbar items by related action or the interface region they affect. Separate unrelated groups with visible space.
- Keep toolbar item presentation consistent within each shared background: use icons consistently, text consistently, or the same icon-and-label pattern.
- Give icon-only actions an accessible label.
- Keep scrolling content visually beneath floating bars while maintaining sufficient contrast at the scroll edge.
- Place tab-like navigation at the bottom on phone-sized layouts and keep it fixed above the safe area. Choose top, side, or trailing placement only when the wider-screen context supports it.

## Recommended CSS Structure

Order the stylesheet as follows:

1. Reset and document defaults
2. Design tokens
3. Background scene
4. Layout
5. Glass primitives
6. Components
7. Interaction states
8. Responsive rules
9. Accessibility and feature fallbacks

Use a reusable primitive similar to:

```css
.glass-surface {
  background: var(--glass-fallback);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow), inset 0 1px 0 var(--glass-highlight);
}

@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-surface {
    background: var(--glass-fill);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(135%);
    backdrop-filter: blur(var(--glass-blur)) saturate(135%);
  }
}
```

Treat this as a starting point, not a fixed palette.

## Visual Judgment

- Create contrast through opacity and spacing before adding more blur.
- Let highlights imply a light source; keep their direction consistent.
- Use large-radius shells sparingly and smaller radii for nested controls.
- Separate overlapping glass surfaces with edge contrast, not only shadows.
- Keep decorative blobs or gradients partially outside the viewport and non-interactive.
- Prefer a calm, tactile result over a crowded collection of glass cards.

## Resources

- Read [references/design-system.md](references/design-system.md) when choosing tokens, elevations, component treatments, and responsive behavior.
- Read [references/apple-toolbar-patterns.md](references/apple-toolbar-patterns.md) whenever building navigation bars, tab bars, segmented controls, menus, or toolbars.
- Read [references/accessibility-and-fallbacks.md](references/accessibility-and-fallbacks.md) before final verification.
- Copy from [assets/static-starter](assets/static-starter) only when creating a new page. For an existing site, adapt its structure rather than replacing working behavior.
