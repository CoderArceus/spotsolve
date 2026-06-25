export function calculatePriority(confirmationCount: number): number {
  // Logarithmic scaling — early confirmations matter more than later ones
  // 1 confirmation  → ~16
  // 3 confirmations → ~32
  // 7 confirmations → ~48
  return Math.round(Math.log2(confirmationCount + 1) * 16);
}
