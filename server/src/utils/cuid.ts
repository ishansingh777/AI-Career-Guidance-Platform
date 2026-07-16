export function cuidLike(seed?: string) {
  // Simple helper for deterministic test ids if needed.
  // For production, always rely on Prisma defaults.
  return seed ?? "";
}

