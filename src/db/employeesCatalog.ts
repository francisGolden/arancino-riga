import type { EmployeeConfig } from '#/types'

export const EMPLOYEES_CATALOG: Record<string, EmployeeConfig> = {
  janis_scooper: {
    id: 'janis_scooper',
    name: 'Jānis',
    roles: ['cashier', 'pastry chef'],
    description:
      'A cheerful guy with a talent for handling loud weekend rushes. Thrives in outdoor environments and family-oriented dessert shops.',
    baseWage: 8,
    preferredBusinessTypes: [
      'street_food',
      'cafe_bakery',
    ],
  },
  arturs_fryer: {
    id: 'arturs_fryer',
    name: 'Artūrs',
    roles: ['cook'],
    description:
      'Mastered the exact frying time for the perfect golden crunch. Prefers the intense heat of bustling street-food kitchens over quiet bakeries.',
    baseWage: 12,
    preferredBusinessTypes: [
      'street_food',
      'fast_food',
    ],
  },
  martins_latte: {
    id: 'martins_latte',
    name: 'Mārtiņš',
    roles: ['barista'],
    description:
      'Pours flawless latte art and works blazingly fast under pressure. The ideal barista for early-morning commuter crowds.',
    baseWage: 14,
    preferredBusinessTypes: [
      'cafe_bakery',
      'fast_food',
    ],
  },
  juris_baker: {
    id: 'juris_baker',
    name: 'Juris',
    roles: ['cook', 'pastry chef'],
    description:
      'Ferments dough with artisanal passion. He is at his best working with organic ingredients in artisan bakeries and slow-food spots.',
    baseWage: 15,
    preferredBusinessTypes: [
      'cafe_bakery',
      'luxury',
    ],
  },
  valters_flipper: {
    id: 'valters_flipper',
    name: 'Valters',
    roles: ['cook'],
    description:
      'Flips heavy pans with dramatic flair. Excels in open-air markets and high-volume brunch spots where food is a spectacle.',
    baseWage: 16,
    preferredBusinessTypes: [
      'street_food',
      'cafe_bakery',
      'restaurant',
    ],
  },
  karlis_matcha: {
    id: 'karlis_matcha',
    name: 'Kārlis',
    roles: ['barista'],
    description:
      'Brews specialty drinks with intense focus. Prefers quiet, alternative cafes where quality and vibes matter more than pure speed.',
    baseWage: 18,
    preferredBusinessTypes: [
      'cafe_bakery',
      'restaurant',
    ],
  },
  rihards_tech: {
    id: 'rihards_tech',
    name: 'Rihards',
    roles: ['cashier'],
    description:
      'Handles brutal lunch rushes with robotic efficiency. Perfect for high-volume corporate districts where customers want their food instantly.',
    baseWage: 20,
    preferredBusinessTypes: [
      'fast_food',
      'street_food',
    ],
  },
  edgars_grill: {
    id: 'edgars_grill',
    name: 'Edgars',
    roles: ['cook'],
    description:
      'A heavy-duty chef who respects premium cuts of meat. At his best working the grill in upscale, scenic restaurants.',
    baseWage: 28,
    preferredBusinessTypes: [
      'restaurant',
      'luxury',
    ],
  },
  roberts_gourmet: {
    id: 'roberts_gourmet',
    name: 'Roberts',
    roles: ['cook'],
    description:
      'Treats luxury ingredients like gold leaf and truffles with absolute reverence. Demands a high-end, fine-dining kitchen to truly shine.',
    baseWage: 45,
    preferredBusinessTypes: [
      'luxury',
      'restaurant',
    ],
  },
  toms_airport: {
    id: 'toms_airport',
    name: 'Toms',
    roles: ['cook'],
    description:
      'Assembles burgers and sandwiches at the speed of light. Shrugs off stress and thrives in 24/7, non-stop transit hubs.',
    baseWage: 22,
    preferredBusinessTypes: [
      'fast_food',
      'street_food',
    ],
  },
  liga_mixer: {
    id: 'liga_mixer',
    name: 'Līga',
    roles: ['cook', 'pastry chef'],
    description:
      'Mixes sweet bases and creams with incredible precision. A natural fit for dessert trucks and sweet-tooth crowds.',
    baseWage: 9,
    preferredBusinessTypes: [
      'street_food',
      'cafe_bakery',
    ],
  },
  madara_sales: {
    id: 'madara_sales',
    name: 'Madara',
    roles: ['cashier'],
    description:
      'Her upselling skills are legendary. Put her in a busy street-food spot and watch your daily revenue multiply.',
    baseWage: 12,
    preferredBusinessTypes: [
      'street_food',
    ],
  },
  ilze_cinnamon: {
    id: 'ilze_cinnamon',
    name: 'Ilze',
    roles: ['cook', 'pastry chef'],
    description:
      'An early bird who loves baking sweet pastries. Shines in cozy kiosks that rely on the morning rush and the smell of fresh butter.',
    baseWage: 14,
    preferredBusinessTypes: [
      'cafe_bakery',
      'street_food',
    ],
  },
  laura_hipster: {
    id: 'laura_hipster',
    name: 'Laura',
    roles: ['cashier'],
    description:
      'Incredibly charismatic and artsy. Customers return just to chat with her, making her perfect for creative neighborhood bakeries.',
    baseWage: 15,
    preferredBusinessTypes: [
      'cafe_bakery',
    ],
  },
  dace_market: {
    id: 'dace_market',
    name: 'Dace',
    roles: ['cashier'],
    description:
      'Charms weekend crowds with a warm smile. Excels at keeping long lines moving smoothly in bustling market environments.',
    baseWage: 16,
    preferredBusinessTypes: [
      'street_food',
    ],
  },
  baiba_plating: {
    id: 'baiba_plating',
    name: 'Baiba',
    roles: ['cook'],
    description:
      'Plates food beautifully for the perfect aesthetic. Ideal for trendy, modern cafes where presentation is just as important as taste.',
    baseWage: 18,
    preferredBusinessTypes: [
      'cafe_bakery',
      'restaurant',
    ],
  },
  zane_poke: {
    id: 'zane_poke',
    name: 'Zane',
    roles: ['cook'],
    description:
      'Slices fresh ingredients with surgical precision. Best suited for modern, health-conscious bistros feeding busy professionals.',
    baseWage: 21,
    preferredBusinessTypes: [
      'restaurant',
    ],
  },
  elina_pints: {
    id: 'elina_pints',
    name: 'Elīna',
    roles: ['barista'],
    description:
      'Pours endless pints and mixes drinks without spilling a drop. The ultimate bartender for high-volume summer terraces.',
    baseWage: 25,
    preferredBusinessTypes: [
      'restaurant',
      'street_food',
    ],
  },
  agnese_vip: {
    id: 'agnese_vip',
    name: 'Agnese',
    roles: ['cashier'],
    description:
      'Manages VIPs and wealthy clients with effortless diplomacy. An absolute must-have front-of-house presence for luxury dining rooms.',
    baseWage: 40,
    preferredBusinessTypes: [
      'luxury',
      'restaurant',
    ],
  },
  ieva_polyglot: {
    id: 'ieva_polyglot',
    name: 'Ieva',
    roles: ['cashier'],
    description:
      'Speaks five languages fluently and never loses her cool. An absolute powerhouse for massive food courts with international foot traffic.',
    baseWage: 22,
    preferredBusinessTypes: [
      'street_food',
      'fast_food',
    ],
  },
}
