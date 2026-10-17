type ClassValue = string | false | null | undefined;

// No conflict merging (no tailwind-merge), so primitives offer variant/size
// props instead of relying on className overrides.
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
