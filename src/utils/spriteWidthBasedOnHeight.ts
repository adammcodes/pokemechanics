function spriteWidthBasedOnHeight(heightInCm: number): number {
  // Define the width range - more aggressive scaling
  const minWidth = 100; // Smaller minimum for tiny Pokemon
  const maxWidth = 180; // Larger maximum for big Pokemon

  // Clamp the height to the valid range
  const clampedWidth = Math.max(minWidth, Math.min(maxWidth, heightInCm));

  // Round to the nearest integer for pixel-perfect sprites
  return Math.round(clampedWidth * 0.5);
}

export default spriteWidthBasedOnHeight;
