/**
 * Groups menu items whose PHOTOGRAPHY looks near-identical at card size --
 * same composition, dish shape, palette and camera angle -- regardless of
 * what the dishes actually are.
 *
 * This is purely about how the strip of cards reads visually. It is not a
 * cuisine taxonomy: ferni and komaj sit together here because both are
 * shot top-down as a single round patterned dish on dark wood, not because
 * they're related foods. Conversely every "khoresh" (stew) item shares one
 * group purely because DivanCafe's own photoshoot shot all ten of them the
 * same way (stew bowl beside a rice plate), while kalam-polo-shirazi --
 * also a main dish, also partly green -- doesn't, because its photo is an
 * overhead shot of herbed rice with meatballs, a different composition
 * entirely.
 *
 * Only items that actually clash need an entry -- anything absent is
 * treated as visually unique and never gets spaced away from anything.
 */
export const VISUAL_GROUPS: Readonly<Record<string, string>> = {
  // Top-down single round patterned dish on dark wood.
  ferni: 'round-patterned-dish',
  komaj: 'round-patterned-dish',
  'sholeh-zard': 'round-patterned-dish',

  // Dark stew bowl paired with a white rice plate, three-quarter angle,
  // cutlery beside -- this is every "khoresh" (stew) item on the menu,
  // shot as one consistent set.
  'khoresh-aloo': 'stew-with-rice',
  'khoresh-aloo-esfenaj': 'stew-with-rice',
  'khoresh-bamieh': 'stew-with-rice',
  'khoresh-fesenjan': 'stew-with-rice',
  'khoresh-gheimeh': 'stew-with-rice',
  'khoresh-ghormeh-sabzi': 'stew-with-rice',
  'khoresh-havij': 'stew-with-rice',
  'khoresh-karafs': 'stew-with-rice',
  'khoresh-khalal-badam': 'stew-with-rice',
  'khoresh-lapeh': 'stew-with-rice',

  // Copper bowl of thick soup shot overhead, with the same steam, tea
  // glass and embroidered napkin props in every shot.
  'ash-reshteh': 'ash-bowl-overhead',
  'ash-shole-ghalamkar': 'ash-bowl-overhead',
  'ash-jo': 'ash-bowl-overhead',

  // Round dish shot overhead with a fried egg (yolk visible) as the focal
  // point.
  'omlet-sabzijat': 'fried-egg-overhead',
  'omlet-gharch': 'fried-egg-overhead',
  'omlet-gojeh': 'fried-egg-overhead',
  mirza: 'fried-egg-overhead',

  // Round platter: saffron rice on one side, grilled protein on the other.
  'joojeh-kabab': 'rice-platter',
  'kabab-koobideh': 'rice-platter',
  'zereshk-polo-morgh': 'rice-platter',

  // Café-table product shot: white plate + small espresso cup and saucer
  // + gold fork, on dark wood -- the majority of the original pastry
  // photoshoot uses this one template.
  baklava: 'cafe-table-pastry',
  'saffron-croissant': 'cafe-table-pastry',
  'walnut-cake': 'cafe-table-pastry',
  tiramisu: 'cafe-table-pastry',
  cheesecake: 'cafe-table-pastry',
  brownie: 'cafe-table-pastry',
  'carrot-cake': 'cafe-table-pastry',
  'lemon-tart': 'cafe-table-pastry',
  'panna-cotta': 'cafe-table-pastry',
  macarons: 'cafe-table-pastry',
  'chocolate-lava-cake': 'cafe-table-pastry',
  waffle: 'cafe-table-pastry',

  // Glass teapot + small glass tea cup on a saucer, on wood with loose
  // spice/herb props -- most of the tea photoshoot uses this template.
  'black-tea': 'teapot-and-glass',
  'chamomile-tea': 'teapot-and-glass',
  'ginger-lemon-tea': 'teapot-and-glass',
  'hibiscus-tea': 'teapot-and-glass',
  'mint-tea': 'teapot-and-glass',
  'saffron-latte': 'teapot-and-glass',
  'chai-bahar': 'teapot-and-glass',
  'green-tea': 'teapot-and-glass',

  // Clear glass tumbler, ice, gold straw, overhead-ish angle on wood --
  // most of the cold-drinks photoshoot uses this template.
  'berry-smoothie': 'iced-drink-glass-straw',
  'caramel-frappuccino': 'iced-drink-glass-straw',
  frappuccino: 'iced-drink-glass-straw',
  'iced-americano': 'iced-drink-glass-straw',
  'iced-latte': 'iced-drink-glass-straw',
  'iced-mocha': 'iced-drink-glass-straw',
  'iced-tea-fresh': 'iced-drink-glass-straw',
  lemonade: 'iced-drink-glass-straw',
  'sekanjabin-fizz': 'iced-drink-glass-straw',

  // Small glass cup of plain black coffee, no visible foam art.
  espresso: 'glass-cup-black-coffee',
  doppio: 'glass-cup-black-coffee',

  // White ceramic cup, overhead-diagonal shot, white latte-art foam.
  'flat-white': 'white-cup-latte-art',
  latte: 'white-cup-latte-art',
  mocha: 'white-cup-latte-art',

  // Dark/warm-toned cup with a chocolate-drizzle or leaf latte-art design.
  cortado: 'latte-art-cup',
  cappuccino: 'latte-art-cup',
};

/** The visual group for an item id, or undefined when it's visually unique. */
export function getVisualGroup(id: string): string | undefined {
  return VISUAL_GROUPS[id];
}
