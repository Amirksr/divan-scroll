/**
 * Strips spaces and dashes from a displayed phone number to build a valid
 * `tel:` href. Extracted from DivanCafe's Footer.tsx, which does this
 * inline (`dict.footer.phone.replace(/\s|-/g, "")`) — pulled out here so
 * it's independently testable and reusable if a click-to-call CTA shows up
 * elsewhere.
 */
export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/\s|-/g, '')}`;
}
