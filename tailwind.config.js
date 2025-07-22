/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Based on docs/design/color-system.md
        'deep-ink': '#0A0A0A',
        'off-white': '#FAF9F6',
        gold: {
          DEFAULT: '#D4AF37',
          muted: '#C5A572',
        },
        grey: {
          DEFAULT: '#A0AEC0',
          dark: '#4A5568',
        },
        success: '#4A7C59',
        warning: '#B8860B',
        error: '#8B2635',
        info: '#4A5568',
        starlight: '#F7FAFC',
        midnight: '#1A202C',
        forest: '#2D5A3D',
        sage: '#4A7C59',
      },
      fontFamily: {
        // Based on docs/design/typography.md and available fonts
        // TODO: Add 'Playfair Display' to project fonts
        serif: ['Georgia', 'serif'],
        // TODO: Add 'Inter' to project fonts
        sans: ['SpaceMono-Regular', 'sans-serif'],
      },
      fontSize: {
        // Based on docs/design/typography.md
        display: '3rem', // 48px
        h1: '2.25rem', // 36px
        h2: '1.75rem', // 28px
        h3: '1.5rem', // 24px
        h4: '1.25rem', // 20px
        'body-large': '1.125rem', // 18px
      },
      lineHeight: {
        tight: '1.1',
        normal: '1.4',
        relaxed: '1.6',
      },
      letterSpacing: {
        tight: '-0.02em',
        wide: '0.05em',
        wider: '0.1em',
      },
    },
  },
  plugins: [],
}
