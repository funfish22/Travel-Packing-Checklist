# Apple-Informed Liquid Glass Toolbar Patterns

Use these rules when translating Apple’s Liquid Glass toolbar guidance to static HTML and CSS. Preserve web semantics instead of copying platform APIs.

Source: [Adopting Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass), especially “Visual refresh,” “Controls,” “Navigation,” and “Menus and toolbars.”

## Functional Layer

- Place navigation and primary controls in a visually distinct topmost layer.
- Let the bar float above or in front of content instead of merging with the content surface.
- Keep content as the visual focus; use glass sparingly on the functional layer.
- Avoid custom decorative backgrounds that compete with the bar’s material.

## Grouping

- Group items that perform similar actions or affect the same content region.
- Maintain stable group order and placement across responsive layouts.
- Separate unrelated groups with a fixed visual gap.
- Do not place unrelated commands inside one continuous glass capsule.
- Hide the entire item when unavailable; do not leave an empty slot inside a group.

For static HTML, use this structure:

```html
<nav class="liquid-toolbar" aria-label="View options">
  <div class="toolbar-group">
    <button type="button" aria-label="Previous">←</button>
    <button type="button" aria-label="Next">→</button>
  </div>
  <div class="toolbar-group">
    <button type="button" aria-label="More options">•••</button>
  </div>
</nav>
```

## Icons and Labels

- Prefer familiar icons for common, frequently used actions when they reduce clutter.
- Give every icon-only control an explicit accessible label.
- Do not mix icon-only, text-only, and icon-plus-text controls within the same shared group without a strong semantic reason.
- Keep symbols optically balanced and use the same visual weight.

## Shape and Interaction

- Use rounded forms that are concentric with their container.
- Keep at least a 44px target size.
- Make the selected item more legible through material, contrast, and elevation—not color alone.
- Use subtle fluid transitions for selection, hover, and focus.
- Do not animate blur values; animate transform and opacity when useful.

## Scrolling and Responsive Behavior

- Preserve contrast when content scrolls beneath the toolbar using tint, blur, or a restrained edge fade.
- On phone-sized layouts, place tab-like primary navigation at the bottom and keep it fixed above `env(safe-area-inset-bottom)`.
- Treat placement as contextual: desktop and tablet toolbars may sit at the top or trailing edge, while an iPhone-style tab or mode switch belongs at the bottom.
- Add enough scroll padding that the final content item can move fully above the fixed toolbar.
- On narrow screens, keep grouping intact. Collapse labels consistently across the entire group if needed.
- Avoid overlapping multiple glass groups.
- Test reduced transparency, reduced motion, increased contrast, keyboard focus, and 320px-wide layouts.

## Web CSS Baseline

```css
.liquid-toolbar {
  position: fixed;
  left: 50%;
  bottom: max(12px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.toolbar-group {
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(20, 32, 48, 0.9);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .toolbar-group {
    background: rgba(255, 255, 255, 0.1);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    backdrop-filter: blur(20px) saturate(140%);
  }
}
```

Adapt the palette and layout to the product. Preserve the grouping and functional-layer principles.
