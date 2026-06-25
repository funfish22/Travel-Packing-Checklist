# Accessibility and Fallbacks

## Required Checks

- Keep normal text contrast near WCAG AA expectations: 4.5:1 for body text and 3:1 for large text.
- Do not place long text directly on highly transparent glass.
- Preserve heading order, labels, button names, and landmark elements.
- Use actual `<button>`, `<input>`, `<nav>`, `<main>`, and `<dialog>`-appropriate semantics rather than clickable `<div>` elements.
- Ensure all interactions work with a keyboard.
- Use `:focus-visible` with a solid, high-contrast outline and offset.
- Keep touch targets approximately 44 by 44 CSS pixels.
- Do not communicate status using color alone.

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Use this only after checking that no interaction depends on animation completion.

## Backdrop Filter Fallback

Declare an opaque or nearly opaque background first, then enhance it:

```css
.glass-surface {
  background: rgba(20, 28, 48, 0.9);
}

@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-surface {
    background: rgba(255, 255, 255, 0.12);
    -webkit-backdrop-filter: blur(20px) saturate(135%);
    backdrop-filter: blur(20px) saturate(135%);
  }
}
```

Never put the only readable background inside `@supports`; unsupported browsers need the safer base style.

## Forced Colors and High Contrast

```css
@media (forced-colors: active) {
  .glass-surface {
    border: 1px solid CanvasText;
    background: Canvas;
    color: CanvasText;
    box-shadow: none;
  }
}
```

Allow native colors and outlines to take precedence.

## Performance

- Avoid large numbers of overlapping backdrop-filter regions.
- Prefer one blurred parent over many blurred children.
- Avoid animating blur values.
- Animate `transform` and `opacity` only when motion is useful.
- Test scrolling on a mobile-sized viewport.
- Remove decorative layers that cause jank before reducing usability.
