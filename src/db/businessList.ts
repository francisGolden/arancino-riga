import type { BusinessConfig } from '#/types'

export const BUSINESS_CATALOG: BusinessConfig[] = [
  {
    id: 'penguin_saldejums_uzvaras',
    baseCost: 750,
    baseIncome: 5,
    name: 'Penguin Saldējums',
    description:
      'A colorful ice cream truck strategically parked in Uzvaras Parks. Perfect for refreshing families and kids after a skateboarding session.',
    location: 'Uzvaras Parks',
    // Ingredienti gelati + Prodotti finiti
    allowedItems: [
      'milk_l',
      'sugar_kg',
      'vanilla_bean',
      'choco_chips_kg',
      'ice_cream_cone',
      'scoop_vanilla',
      'scoop_chocolate',
    ],
  },
  {
    id: 'arancino_riga_agenskalns',
    baseCost: 2500,
    baseIncome: 15,
    name: 'Arančino Rīga',
    description:
      'Artisan arancini shop located inside the beautiful, renovated Āgenskalns indoor market (Āgenskalna tirgus). Blends Sicilian street food with the Latvian spirit.',
    location: 'Āgenskalns',
    // Ingredienti arancini base, latvian, cheesy + Prodotti finiti
    allowedItems: [
      'rice_kg',
      'saffron_g',
      'minced_meat_kg',
      'peas_kg',
      'frying_oil_l',
      'breadcrumbs_kg',
      'biezpiens_kg',
      'mozzarella_kg',
      'arancino_base',
      'arancino_latvian',
    ],
  },
  {
    id: 'kiosk_vermanes_darzs',
    baseCost: 6000,
    baseIncome: 32,
    name: 'Vērmanes Kafija Kiosk',
    description:
      'A small but bustling coffee and cereal bar kiosk in the historic Vērmanes dārzs park. The favorite pit stop for downtown commuters.',
    location: 'Vērmanes dārzs',
    // Ingredienti caffetteria e cinnamon roll + Prodotti finiti
    allowedItems: [
      'coffee_beans_kg',
      'milk_l',
      'flour_kg',
      'butter_kg',
      'sugar_kg',
      'yeast_g',
      'espresso',
      'cappuccino',
      'cinnamon_roll',
    ],
  },
  {
    id: 'pizza_tallinas_kvartals',
    baseCost: 14000,
    baseIncome: 70,
    name: 'Tallinas Kvartāls Maiznīca', // (Mantenuto nome originale dalla tua lista, anche se ID è pizza_...)
    description:
      'Artisan pizza shop in the heart of the Tallinas creative district. Attracts hipsters, artists, and lovers of organic baked goods.',
    location: 'Tallinas Kvartāls',
    // Ingredienti panetteria (Rupjmaize) + Prodotti finiti
    allowedItems: ['rye_flour_kg', 'yeast_g', 'sugar_kg', 'rupjmaize_loaf'],
  },
  {
    id: 'pancake_kalnciema',
    baseCost: 28000,
    baseIncome: 125,
    name: 'Kalnciema Pankūkas',
    description:
      'A cozy spot specializing in sweet and savory pancakes, nestled among the characteristic wooden houses of the Kalnciema kvartāls Saturday market.',
    location: 'Kalnciema',
    // Ingredienti pancakes sweet e savory + Prodotti finiti
    allowedItems: [
      'flour_kg',
      'eggs_dozen',
      'milk_l',
      'butter_kg',
      'honey_jar',
      'bacon_kg',
      'pancake_sweet',
      'pancake_savory',
    ],
  },
  {
    id: 'cafe_miera_iela',
    baseCost: 55000,
    baseIncome: 220,
    name: 'Miera Iela Hipster Cafē',
    description:
      "Literary cafe and independent roastery on Riga's most alternative street. Great atmosphere for students and matcha tea lovers.",
    location: 'Brasa (Miera iela)',
    // Ingredienti matcha latte, avocado toast (e sua variante from scratch) + Prodotti finiti
    allowedItems: [
      'matcha_powder_g',
      'oat_milk_l',
      'rupjmaize_loaf',
      'avocado_unit',
      'eggs_dozen',
      'rye_flour_kg',
      'yeast_g',
      'matcha_latte',
      'avocado_toast',
    ],
  },
  {
    id: 'tech_bistro_teika',
    baseCost: 120000,
    baseIncome: 450,
    name: 'Teika Tech Bistro',
    description:
      'A modern fast-casual bistro located in the Jaunā Teika technology hub. Feeds hundreds of hungry programmers and startup founders every lunch break.',
    location: 'Jaunā Teika',
    // Ingredienti poke bowl + caffè industriale + Prodotti finiti
    allowedItems: [
      'salmon_kg',
      'rice_kg',
      'avocado_unit',
      'coffee_beans_kg',
      'poke_bowl',
      'espresso',
    ],
  },
  {
    id: 'sunset_grill_andrejosta',
    baseCost: 260000,
    baseIncome: 900,
    name: 'Andrejosta Sunset Grill',
    description:
      'Elegant restaurant with a terrace overlooking the Daugava river in the marina area. Generates massive profits during summer evenings thanks to the sunset view.',
    location: 'Andrejosta',
    // Ingredienti steak, birra artigianale + Prodotti finiti
    allowedItems: [
      'premium_beef_kg',
      'potatoes_kg',
      'butter_kg',
      'craft_beer_keg',
      'grilled_steak',
      'beer_pint',
    ],
  },
  {
    id: 'fine_dining_vecriga',
    baseCost: 580000,
    baseIncome: 1800,
    name: 'Vecrīga Luxury Dining',
    description:
      'Haute cuisine restaurant located in a historic building in the Old Town. An exclusive destination for wealthy tourists, gala dinners, and diplomatic delegations.',
    location: 'Vecrīga',
    // Ingredienti lusso estremo (risotto, blini, truffle arancino) + Prodotti finiti
    allowedItems: [
      'rice_kg',
      'truffle_whole',
      'butter_kg',
      'gold_leaf',
      'flour_kg',
      'eggs_dozen',
      'milk_l',
      'caviar_tin',
      'premium_beef_kg',
      'frying_oil_l',
      'breadcrumbs_kg',
      'truffle_risotto',
      'caviar_blini',
      'arancino_truffle',
    ],
  },
  {
    id: 'airport_food_court',
    baseCost: 1350000,
    baseIncome: 3800,
    name: 'Lidosta Rīga Food Empire',
    description:
      'The pinnacle of your commercial empire: an entire block in the food court of Riga International Airport. Guaranteed customer traffic 24/7.',
    location: 'Mārupe (Lidosta Rīga)',
    // Ingredienti fast food e travel sandwich + Prodotti finiti
    allowedItems: [
      'burger_patty',
      'burger_bun',
      'bacon_kg',
      'rupjmaize_loaf',
      'salmon_kg',
      'eggs_dozen',
      'airport_burger',
      'travel_sandwich',
    ],
  },
]
