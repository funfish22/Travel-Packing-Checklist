# Liquid Glass Design System

## Token Baseline

Adapt these ranges to the page background and content density:

| Token | Typical range | Purpose |
| --- | --- | --- |
| Glass fill | 8–22% white or dark tint | Translucent surface |
| Fallback fill | 78–94% opaque | Readable non-blur fallback |
| Border | 18–40% light tint | Edge definition |
| Blur | 12–28px | Background diffusion |
| Saturation | 115–150% | Color retained through glass |
| Radius | 14–32px | Surface hierarchy |
| Shadow | 12–36px blur, low alpha | Separation without heaviness |

Prefer one accent hue plus neutral glass. Use a second accent only for status or destructive actions.

## Elevation Levels

### Level 1: Embedded

Use for list rows, secondary controls, and input wells.

- Lowest opacity contrast
- Small radius
- Minimal shadow
- Little or no backdrop blur when nested inside another glass surface

### Level 2: Floating

Use for the main application shell, cards, navigation, and toolbars.

- Medium blur and border contrast
- Soft outer shadow
- One subtle inset highlight

### Level 3: Overlay

Use for dialogs, popovers, and important transient surfaces.

- Most opaque fill
- Strongest edge definition
- Sufficient contrast over any content beneath it

## Component Guidance

### Buttons

- Keep primary actions more opaque than surrounding glass.
- Use color, weight, and position—not glow alone—to show importance.
- Move by no more than 1–2px on hover or active states.

### Toolbars

- Float the toolbar as a distinct functional layer above content.
- Put tab-like primary navigation at the fixed bottom edge on phone-sized layouts, above the safe area. Use top or side placement when the wider-screen context calls for it.
- Group controls that perform similar actions or affect the same region.
- Give each functional group one shared glass background; use spacing between unrelated groups instead of one continuous capsule.
- Keep icon and label treatment consistent within a group.
- Use standard, familiar symbols for common actions and always provide accessible names.
- Allow content to remain visible beneath the bar, but use sufficient blur, tint, or a scroll-edge fade to preserve legibility.
- Use concentric radii: the outer group radius should visually contain the inner control radius with even insets.

### Inputs

- Use a quiet inset surface with a clearly visible border.
- Preserve native text selection and autofill usability.
- Give `:focus-visible` a solid outline that is not dependent on transparency.

### Lists

- Avoid an individual heavy glass card for every row.
- Use one containing surface plus restrained row separators or soft embedded fills.

### Modals

- Darken or blur the page scrim enough to separate layers.
- Keep the modal fill more opaque than ordinary cards.
- Do not rely on backdrop blur as the only separation cue.

## Responsive Guidance

- Reduce blur and decorative background complexity on small screens.
- Let the main shell reach the viewport edges when space is tight.
- Maintain touch targets of about 44px.
- Avoid fixed heights that hide content when browser chrome or text size changes.
- Use `min-height: 100dvh` with a reasonable `100vh` fallback where needed.

## Background Scene

Glass requires visible material behind it. Build depth with one of:

- Two or three radial gradients
- A restrained local image with an overlay
- Blurred pseudo-elements or absolutely positioned color fields

Set decorative layers to `pointer-events: none` and keep them out of the accessibility tree.
