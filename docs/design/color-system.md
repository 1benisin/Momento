# Color System

## Color Philosophy

Momento's color system emphasizes **minimalism, sophistication, and accessibility**. The palette is designed to create a premium feel while maintaining excellent readability and supporting the "esoteric-tarot meets Art Deco" aesthetic.

## Primary Color Palette

### Background Colors

- **Deep Inky Black** (`#000000` or `#0A0A0A`)
  - Primary background for dark mode
  - Creates dramatic contrast and premium feel
  - Alternative: Very dark navy (`#0F1419`) for slightly warmer tone

- **Creamy Off-White** (`#F8F6F1` or `#FAF9F6`)
  - Primary background for light mode
  - Warm, inviting tone that feels premium
  - High contrast for excellent readability

### Accent Colors

- **Warm Metallic Gold** (`#D4AF37` or `#B8860B`)
  - Primary accent color for premium elements
  - Used for borders, highlights, and important UI elements
  - Flat, uniform line weight for consistent application

- **Muted Gold** (`#C5A572` or `#B8A67A`)
  - Secondary gold for subtle accents
  - Used for less prominent decorative elements
  - Softer alternative to primary gold

## Semantic Color System

### Success States

- **Success Green** (`#4A7C59` or `#2D5A3D`)
  - Confirmation messages, successful actions
  - Muted, sophisticated tone that fits the aesthetic

### Warning States

- **Warning Amber** (`#B8860B` or `#D4AF37`)
  - Warning messages, important notices
  - Uses gold tones to maintain aesthetic consistency

### Error States

- **Error Red** (`#8B2635` or `#6B1F2A`)
  - Error messages, destructive actions
  - Muted red that doesn't clash with the palette

### Information States

- **Info Blue** (`#4A5568` or `#2D3748`)
  - Information messages, neutral states
  - Muted blue-grey that complements the palette

## Text Colors

### Primary Text

- **Creamy Off-White** (`#F8F6F1`)
  - High-contrast titles and primary text on dark backgrounds
  - Excellent readability and premium feel

### Secondary Text

- **Light Grey** (`#A0AEC0` or `#718096`)
  - Secondary information, captions, metadata
  - Reduced contrast for visual hierarchy

### Muted Text

- **Dark Grey** (`#4A5568` or `#2D3748`)
  - Tertiary information, disabled states
  - Maintains readability while reducing emphasis

## Decorative Color Palette

### Celestial Elements

- **Starlight White** (`#F7FAFC`)
  - Stars, moon highlights, celestial accents
  - Pure white for maximum contrast and sparkle

- **Midnight Blue** (`#1A202C`)
  - Night sky elements, cosmic backgrounds
  - Deep blue that complements the black/gold palette

### Botanical Elements

- **Forest Green** (`#2D5A3D`)
  - Leaves, vines, natural elements
  - Muted green that feels organic and sophisticated

- **Sage Green** (`#4A7C59`)
  - Secondary botanical elements
  - Lighter green for variety and depth

## Accessibility Considerations

### Contrast Ratios

All color combinations must meet WCAG AA standards:

- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text:** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 contrast ratio

### Color Blindness Support

- **Avoid color-only indicators** for important information
- **Use patterns, icons, and text** in addition to color
- **Test with color blindness simulators** for all color combinations

### High Contrast Mode

- **Support system high contrast settings**
- **Provide alternative color schemes** for accessibility
- **Ensure all interactive elements** are clearly visible

## Usage Guidelines

### Primary Elements

- **Backgrounds:** Use deep black or creamy off-white as primary backgrounds
- **Text:** Use high-contrast combinations for maximum readability
- **Borders:** Use warm metallic gold for premium elements and important containers

### Accent Elements

- **Buttons:** Use gold for primary actions, muted colors for secondary
- **Icons:** Use gold for important icons, grey for decorative elements
- **Highlights:** Use gold sparingly for key information and premium features

### Decorative Elements

- **Borders:** Use gold for frame-like compositions and premium containers
- **Illustrations:** Use the full palette for storytelling and visual interest
- **Backgrounds:** Use subtle gradients and patterns for depth

## Implementation Specifications

### CSS Variables

```css
:root {
  /* Primary Colors */
  --color-background-dark: #000000;
  --color-background-light: #f8f6f1;
  --color-gold-primary: #d4af37;
  --color-gold-secondary: #c5a572;

  /* Text Colors */
  --color-text-primary: #f8f6f1;
  --color-text-secondary: #a0aec0;
  --color-text-muted: #4a5568;

  /* Semantic Colors */
  --color-success: #4a7c59;
  --color-warning: #b8860b;
  --color-error: #8b2635;
  --color-info: #4a5568;

  /* Decorative Colors */
  --color-starlight: #f7fafc;
  --color-midnight: #1a202c;
  --color-forest: #2d5a3d;
  --color-sage: #4a7c59;
}
```

### Dark Mode Support

```css
[data-theme='dark'] {
  --color-background: var(--color-background-dark);
  --color-text: var(--color-text-primary);
}

[data-theme='light'] {
  --color-background: var(--color-background-light);
  --color-text: var(--color-text-muted);
}
```

## Color Testing

### Tools for Testing

- **Contrast checkers:** WebAIM Contrast Checker, Stark
- **Color blindness simulators:** Color Oracle, Coblis
- **Accessibility validators:** axe DevTools, Lighthouse

### Testing Checklist

- [ ] All text meets minimum contrast ratios
- [ ] Color combinations work for color blind users
- [ ] High contrast mode is supported
- [ ] Interactive elements are clearly visible
- [ ] Decorative elements don't interfere with functionality

---

**Next Steps:** See [Typography](./typography.md) for font specifications and [Component Library](./components.md) for implementation examples.
