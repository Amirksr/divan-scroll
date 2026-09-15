/**
 * Groups menu items whose PHOTOGRAPHY looks near-identical at card size --
 * same composition, dish shape, palette and camera angle -- regardless of
 * what the dishes actually are.
 *
 * This is purely about how the strip of cards reads visually. It is not a
 * cuisine taxonomy: ferni and komaj sit together here because both are
 * shot top-down as a single round patterned dish on dark wood, not because
 * they're related foods. Conversely the three khoresh photos share a group
 * while kalam-polo doesn't, even though all four are main dishes, because
 * the khoresh shots all use the same stew-bowl-plus-rice-plate framing.
 *
 * Only items that actually clash need an entry -- anything absent is
 * treated as visually unique and never gets spaced away from anything.
 */
export const VISUAL_GROUPS: Readonly<Record<string, string>> = {
  // Top-down single round patterned dish on dark wood.
  ferni: 'round-patterned-dish',
  komaj: 'round-patterned-dish',

  // Dark stew bowl paired with a white rice plate, three-quarter angle.
  'khoresh-gheimeh': 'stew-with-rice',
  'khoresh-fesenjan': 'stew-with-rice',
  'khoresh-ghormeh-sabzi': 'stew-with-rice',

  // Wide bowl dominated by green herbs.
  'ash-reshteh': 'herbed-green-dish',
  'kalam-polo-shirazi': 'herbed-green-dish',

  // Round platter: saffron rice on one side, grilled protein on the other.
  'joojeh-kabab': 'rice-platter',
  'kabab-koobideh': 'rice-platter',
  'zereshk-polo-morgh': 'rice-platter',

  // Glass/cup of milk coffee shot from above with latte art.
  cortado: 'latte-art-cup',
  cappuccino: 'latte-art-cup',

  // Single dessert portion plated on a pale patterned plate.
  tiramisu: 'plated-dessert',
  'chocolate-lava-cake': 'plated-dessert',
};

/** The visual group for an item id, or undefined when it's visually unique. */
export function getVisualGroup(id: string): string | undefined {
  return VISUAL_GROUPS[id];
}
