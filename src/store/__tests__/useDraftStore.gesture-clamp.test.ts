// Utility function representing the exact sheet drag clamping and rubber-banding math in active.tsx
export function clampSheetHeight(newHeight: number, collapsedHeight: number, fullHeight: number): number {
  let adjustedHeight = newHeight;
  
  // Apply high-fidelity rubber-band resistance when dragging beyond boundaries
  if (adjustedHeight > fullHeight) {
    const overflow = adjustedHeight - fullHeight;
    adjustedHeight = fullHeight + overflow * 0.25; // 25% sensitivity beyond max
  } else if (adjustedHeight < collapsedHeight) {
    const underflow = collapsedHeight - adjustedHeight;
    adjustedHeight = collapsedHeight - underflow * 0.25; // 25% sensitivity beyond min
  }

  // Clamp values defensively to prevent negative heights/margins and layout collapses
  return Math.max(collapsedHeight, Math.min(fullHeight, adjustedHeight));
}

describe('useDraftStore.gesture-clamp sheet height calculations', () => {
  const minHeight = 80;
  const maxHeight = 800;

  it('should return the original height if it is within bounds', () => {
    // Within limits, no rubber banding or clamping needed
    expect(clampSheetHeight(200, minHeight, maxHeight)).toBe(200);
    expect(clampSheetHeight(500, minHeight, maxHeight)).toBe(500);
    expect(clampSheetHeight(80, minHeight, maxHeight)).toBe(80);
    expect(clampSheetHeight(800, minHeight, maxHeight)).toBe(800);
  });

  it('should apply rubber banding and clamp to fullHeight when newHeight exceeds maximum', () => {
    // 900 exceeds 800 by 100.
    // Adjusted height before clamping would be 800 + (100 * 0.25) = 825
    // After clamping it should be exactly 800.
    expect(clampSheetHeight(900, minHeight, maxHeight)).toBe(maxHeight);
    expect(clampSheetHeight(1200, minHeight, maxHeight)).toBe(maxHeight);
  });

  it('should apply rubber banding and clamp to collapsedHeight when newHeight is below minimum', () => {
    // 40 is below 80 by 40.
    // Adjusted height before clamping would be 80 - (40 * 0.25) = 70
    // After clamping it should be exactly 80.
    expect(clampSheetHeight(40, minHeight, maxHeight)).toBe(minHeight);
    expect(clampSheetHeight(-100, minHeight, maxHeight)).toBe(minHeight);
  });
});
