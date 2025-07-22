# Typography

## Typography Philosophy

Momento's typography system combines **classic elegance with modern readability**. The type choices reflect the "esoteric-tarot meets Art Deco" aesthetic while ensuring excellent accessibility and user experience across all devices.

## Font Choices

### Primary Font: Serif for Titles

**"PETER PAN" Style - All-caps serif with chunky stems and subtle bracketed serifs**

- **Font Family:** A serif font with early-20th-century book-press feel
- **Characteristics:** Chunky stems, subtle bracketed serifs, substantial weight
- **Usage:** Main titles, hero text, premium elements
- **Examples:** Playfair Display, Merriweather, or similar serif fonts

### Secondary Font: Sans-serif for Body

**"JM BARRIE" Style - Small, spaced-out sans or light serif**

- **Font Family:** Clean sans-serif for body text and UI elements
- **Characteristics:** Light weight, good spacing, excellent readability
- **Usage:** Body text, UI labels, secondary information
- **Examples:** Inter, Open Sans, or similar modern sans-serif fonts

## Type Scale

### Display (Hero Text)

- **Size:** 48px / 3rem
- **Weight:** Bold (700)
- **Line Height:** 1.1
- **Usage:** Main page titles, hero sections, premium announcements

### H1 (Page Titles)

- **Size:** 36px / 2.25rem
- **Weight:** Bold (700)
- **Line Height:** 1.2
- **Usage:** Page headers, major section titles

### H2 (Section Titles)

- **Size:** 28px / 1.75rem
- **Weight:** Semi-bold (600)
- **Line Height:** 1.3
- **Usage:** Section headers, card titles

### H3 (Subsection Titles)

- **Size:** 24px / 1.5rem
- **Weight:** Medium (500)
- **Line Height:** 1.4
- **Usage:** Subsection headers, feature titles

### H4 (Component Titles)

- **Size:** 20px / 1.25rem
- **Weight:** Medium (500)
- **Line Height:** 1.4
- **Usage:** Component headers, form labels

### Body Large

- **Size:** 18px / 1.125rem
- **Weight:** Regular (400)
- **Line Height:** 1.6
- **Usage:** Important body text, lead paragraphs

### Body (Default)

- **Size:** 16px / 1rem
- **Weight:** Regular (400)
- **Line Height:** 1.6
- **Usage:** Primary body text, main content

### Body Small

- **Size:** 14px / 0.875rem
- **Weight:** Regular (400)
- **Line Height:** 1.5
- **Usage:** Secondary text, captions, metadata

### Caption

- **Size:** 12px / 0.75rem
- **Weight:** Regular (400)
- **Line Height:** 1.4
- **Usage:** Small labels, timestamps, fine print

## Typography Hierarchy

### Primary Hierarchy

1. **Display** - Most important, attention-grabbing text
2. **H1** - Page-level organization
3. **H2** - Section-level organization
4. **H3** - Subsection organization
5. **Body** - Main content and readability

### Secondary Hierarchy

1. **H4** - Component-level organization
2. **Body Large** - Enhanced readability for important content
3. **Body Small** - Supporting information
4. **Caption** - Metadata and fine details

## Font Pairing Guidelines

### Title + Body Combinations

**Serif + Sans-serif Pairing:**

- **Titles:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Usage:** Premium content, event invitations, hero sections

**Sans-serif + Sans-serif Pairing:**

- **Titles:** Inter Bold
- **Body:** Inter Regular
- **Usage:** UI elements, forms, functional content

### Spacing and Layout

**Letter Spacing:**

- **Titles:** Slightly increased letter spacing (0.02em to 0.05em)
- **Body:** Normal letter spacing
- **All-caps:** Increased letter spacing (0.1em to 0.15em)

**Word Spacing:**

- **Titles:** Normal word spacing
- **Body:** Normal word spacing
- **Small text:** Slightly tighter word spacing

## Implementation Specifications

### CSS Variables

```css
:root {
  /* Font Families */
  --font-family-serif: 'Playfair Display', Georgia, serif;
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Font Sizes */
  --font-size-display: 3rem; /* 48px */
  --font-size-h1: 2.25rem; /* 36px */
  --font-size-h2: 1.75rem; /* 28px */
  --font-size-h3: 1.5rem; /* 24px */
  --font-size-h4: 1.25rem; /* 20px */
  --font-size-body-large: 1.125rem; /* 18px */
  --font-size-body: 1rem; /* 16px */
  --font-size-body-small: 0.875rem; /* 14px */
  --font-size-caption: 0.75rem; /* 12px */

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.1;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.6;

  /* Letter Spacing */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.05em;
  --letter-spacing-wider: 0.1em;
}
```

### Typography Classes

```css
/* Display Text */
.text-display {
  font-family: var(--font-family-serif);
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

/* Headings */
.text-h1 {
  font-family: var(--font-family-serif);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-wide);
}

.text-h2 {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  letter-spacing: var(--letter-spacing-normal);
}

/* Body Text */
.text-body {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-relaxed);
  letter-spacing: var(--letter-spacing-normal);
}

.text-body-large {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-body-large);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-relaxed);
  letter-spacing: var(--letter-spacing-normal);
}
```

## Accessibility Considerations

### Readability Standards

- **Minimum font size:** 12px for captions, 14px for body text
- **Line length:** Maximum 65-75 characters per line
- **Line height:** Minimum 1.4 for body text, 1.2 for headings
- **Contrast ratio:** Minimum 4.5:1 for normal text, 3:1 for large text

### Screen Reader Support

- **Semantic HTML:** Use proper heading tags (h1, h2, h3, etc.)
- **Alternative text:** Provide alt text for decorative typography
- **Focus indicators:** Ensure text is readable when focused
- **Zoom support:** Text remains readable at 200% zoom

### Mobile Considerations

- **Touch targets:** Minimum 44px height for interactive text
- **Readable sizes:** Ensure text is readable on small screens
- **Tap targets:** Adequate spacing between interactive elements
- **Orientation:** Text remains readable in both orientations

## Usage Guidelines

### When to Use Serif Fonts

- **Main titles** and hero text
- **Event invitations** and premium content
- **Brand elements** and logos
- **Decorative headings** and special announcements

### When to Use Sans-serif Fonts

- **Body text** and main content
- **UI elements** and form labels
- **Navigation** and menu items
- **Functional text** and instructions

### Text Styling Best Practices

- **Limit all-caps** to titles and important labels
- **Use proper hierarchy** to guide user attention
- **Maintain consistency** across similar elements
- **Consider context** when choosing font styles
- **Test readability** across different devices and conditions

## Responsive Typography

### Mobile Adjustments

```css
@media (max-width: 768px) {
  :root {
    --font-size-display: 2.5rem; /* 40px */
    --font-size-h1: 2rem; /* 32px */
    --font-size-h2: 1.5rem; /* 24px */
    --font-size-h3: 1.25rem; /* 20px */
    --font-size-body-large: 1rem; /* 16px */
  }
}
```

### Tablet Adjustments

```css
@media (min-width: 769px) and (max-width: 1024px) {
  :root {
    --font-size-display: 2.75rem; /* 44px */
    --font-size-h1: 2.125rem; /* 34px */
    --font-size-h2: 1.625rem; /* 26px */
  }
}
```

---

**Next Steps:** See [Iconography & Illustrations](./iconography.md) for visual element guidelines and [Component Library](./components.md) for implementation examples.
