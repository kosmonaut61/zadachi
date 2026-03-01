export type Palette = 'zadachi' | 'highlighter' | 'stoplight' | 'neon' | 'garden'

export interface PaletteColors {
  // DARK category - used for backgrounds, text on light surfaces, outlines
  bg: string       // Deepest background (page bg, modal overlays)
  face: string     // Clock face fill, secondary panels
  dark: string     // Text on light, outlines, hands on light faces

  // LIGHT category - used for foreground, accents, text on dark surfaces
  accent1: string  // Primary accent (hands, buttons, interactive)
  accent2: string  // Secondary accent (rings, highlights, dots)
  light: string    // Lightest (text on dark, progress indicators, light fills)
}

export const palettes: Record<Palette, PaletteColors> = {
  zadachi: {
    bg: '#001F27',       // Ink Black
    face: '#003A35',     // Evergreen
    dark: '#001F27',     // Ink Black (text/outlines on light)
    accent1: '#719A73',  // Sage Green
    accent2: '#1F73C2',  // Bright Marine
    light: '#F5F5F5',    // Light
  },
  highlighter: {
    bg: '#1B3A6B',       // Deep Navy (dark background)
    face: '#FFD200',     // Highlighter Yellow
    dark: '#1B3A6B',     // Deep Navy (text/outlines on light)
    accent1: '#FD7903',  // Acid Tangerine
    accent2: '#316DD5',  // Hyper Blue
    light: '#FFFCCD',    // Almost There
  },
  stoplight: {
    bg: '#2B3537',       // Gunmetal (dark background)
    face: '#B0323A',     // Sweet Brown (face fill)
    dark: '#2B3537',     // Gunmetal (text/outlines on light)
    accent1: '#C87C0C',  // Mustard Brown (primary accent)
    accent2: '#8AA8AB',  // Cadet Grey (secondary accent)
    light: '#F0D8C3',    // Dutch White (light text/fills)
  },
  neon: {
    bg: '#000000',       // Black (dark background)
    face: '#7D39EB',     // Violet (face fill)
    dark: '#000000',     // Black (text/outlines on light)
    accent1: '#C6FF33',  // Lime (primary accent)
    accent2: '#7D39EB',  // Violet (secondary accent)
    light: '#FFFFFF',    // White (light text/fills)
  },
  garden: {
    bg: '#012B3A',       // Nocturn (dark navy background)
    face: '#007878',     // Spruce (dark teal face fill)
    dark: '#012B3A',     // Nocturn (text/outlines on light)
    accent1: '#FF4C46',  // Saffron (coral red primary accent)
    accent2: '#42D49C',  // Jade (jade green secondary accent)
    light: '#DFFFDE',    // Tea (very light mint text/fills)
  },
}

// Helper to get all palette colors as an array (for confetti, etc.)
export function getPaletteArray(palette: Palette): string[] {
  const p = palettes[palette]
  return [p.bg, p.face, p.accent1, p.accent2, p.light]
}
