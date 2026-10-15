type ClassValue = string | false | null | undefined;

// Joins the truthy class names. There is no conflict merging, so primitives
// expose variant/size props instead of relying on className overrides.
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
