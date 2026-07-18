/** Capitalize the first character of a string. */
export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Convert an ENUM_LIKE_VALUE into a human-readable label ("Enum Like Value"). */
export function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map(capitalize)
    .join(' ');
}

/** Build initials from a first and last name (e.g. "AB"). */
export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
