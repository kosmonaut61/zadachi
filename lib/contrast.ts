// WCAG 2.1 contrast ratio calculation
// AA standard requires 4.5:1 for normal text, 3:1 for large text

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const sRGB = val / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

export function getAccessibleTextColor(
  backgroundColor: string,
  lightColor: string,
  darkColor: string
): string {
  const contrastWithLight = getContrastRatio(backgroundColor, lightColor)
  const contrastWithDark = getContrastRatio(backgroundColor, darkColor)

  // WCAG AA requires 4.5:1 for normal text
  // Return the color with better contrast, preferring light if both pass
  if (contrastWithLight >= 4.5) return lightColor
  if (contrastWithDark >= 4.5) return darkColor
  
  // If neither meets AA standard, return whichever has better contrast
  return contrastWithLight > contrastWithDark ? lightColor : darkColor
}
