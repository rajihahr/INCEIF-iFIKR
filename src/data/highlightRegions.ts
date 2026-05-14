// Approximate highlight regions (percentage of page width/height)
// Manually estimated for this build; production can use pdf.js text search or server coordinates
export const highlightRegions: Record<
  number,
  { top: number; left: number; width: number; height: number }
> = {
  1: { top: 42, left: 8, width: 84, height: 6 },
  2: { top: 28, left: 8, width: 84, height: 12 },
  3: { top: 48, left: 8, width: 84, height: 14 },
  4: { top: 62, left: 8, width: 84, height: 6 },
  5: { top: 8, left: 8, width: 84, height: 14 },
  6: { top: 22, left: 8, width: 84, height: 6 },
  7: { top: 60, left: 8, width: 84, height: 6 },
  8: { top: 20, left: 8, width: 84, height: 12 },
  9: { top: 56, left: 8, width: 84, height: 8 },
  10: { top: 72, left: 8, width: 84, height: 6 },
  11: { top: 20, left: 8, width: 84, height: 8 },
}
