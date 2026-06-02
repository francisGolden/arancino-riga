import type { IngredientConfig } from "#/types";

export const INGREDIENTS_CATALOG: Record<string, IngredientConfig> = {
  // --- INGREDIENTI: ARANCINI & STREET FOOD ---
  rice_kg: { id: 'rice_kg', name: 'Arborio Rice (Kg)', baseCost: 2, description: 'The perfect base for every arancino.' },
  saffron_g: { id: 'saffron_g', name: 'Saffron (g)', baseCost: 15, description: 'Red gold. It gives arancini their iconic color.' },
  mozzarella_kg: { id: 'mozzarella_kg', name: 'Mozzarella (Kg)', baseCost: 8, description: 'Stretchy and excellent quality.' },
  minced_meat_kg: { id: 'minced_meat_kg', name: 'Minced Meat (Kg)', baseCost: 7, description: 'Ground meat for a perfect ragù.' },
  peas_kg: { id: 'peas_kg', name: 'Peas (Kg)', baseCost: 3, description: 'Sweet peas, essential for the classic recipe.' },
  frying_oil_l: { id: 'frying_oil_l', name: 'Frying Oil (L)', baseCost: 4, description: 'Seed oil resistant to high temperatures.' },
  breadcrumbs_kg: { id: 'breadcrumbs_kg', name: 'Breadcrumbs (Kg)', baseCost: 2, description: 'For a crispy coating that goes crunch.' },
  biezpiens_kg: { id: 'biezpiens_kg', name: 'Biezpiens (Kg)', baseCost: 5, description: 'Latvian curd cheese flakes for fusion recipes.' },
  
  // --- INGREDIENTI: GELATERIA (Uzvaras Parks) ---
  milk_l: { id: 'milk_l', name: 'Fresh Milk (L)', baseCost: 1, description: 'Whole milk from Latvian farms.' },
  sugar_kg: { id: 'sugar_kg', name: 'Sugar (Kg)', baseCost: 1, description: 'Refined white sugar.' },
  vanilla_bean: { id: 'vanilla_bean', name: 'Vanilla Bean', baseCost: 12, description: 'Madagascar vanilla pod.' },
  choco_chips_kg: { id: 'choco_chips_kg', name: 'Chocolate Chips (Kg)', baseCost: 9, description: 'Dark chocolate chips.' },
  ice_cream_cone: { id: 'ice_cream_cone', name: 'Wafer Cone', baseCost: 0.5, description: 'Crispy wafer cone.' },
  
  // --- INGREDIENTI: CAFFETTERIA & PANIFICIO ---
  coffee_beans_kg: { id: 'coffee_beans_kg', name: 'Coffee Beans (Kg)', baseCost: 18, description: 'Dark-roasted Arabica beans.' },
  flour_kg: { id: 'flour_kg', name: 'Wheat Flour (Kg)', baseCost: 1, description: 'Type 00 flour.' },
  rye_flour_kg: { id: 'rye_flour_kg', name: 'Rye Flour (Kg)', baseCost: 2, description: 'Rye flour for authentic Latvian bread.' },
  yeast_g: { id: 'yeast_g', name: 'Fresh Yeast (g)', baseCost: 1, description: 'Fresh brewer\'s yeast.' },
  butter_kg: { id: 'butter_kg', name: 'Butter (Kg)', baseCost: 6, description: 'Rich and creamy butter.' },
  eggs_dozen: { id: 'eggs_dozen', name: 'Eggs (Dozen)', baseCost: 3, description: 'Fresh eggs from free-range hens.' },
  honey_jar: { id: 'honey_jar', name: 'Local Honey (Jar)', baseCost: 8, description: 'Honey from Latvian forests.' },
  bacon_kg: { id: 'bacon_kg', name: 'Bacon (Kg)', baseCost: 10, description: 'Wood-smoked bacon.' },
  
  // --- INGREDIENTI: HIPSTER CAFE & BISTRO ---
  matcha_powder_g: { id: 'matcha_powder_g', name: 'Matcha Powder (g)', baseCost: 25, description: 'Ceremonial-grade Japanese green tea powder.' },
  oat_milk_l: { id: 'oat_milk_l', name: 'Oat Milk (L)', baseCost: 3, description: 'A popular plant-based alternative.' },
  avocado_unit: { id: 'avocado_unit', name: 'Avocado', baseCost: 2, description: 'Soft and ready to spread.' },
  kombucha_bottle: { id: 'kombucha_bottle', name: 'Raw Kombucha', baseCost: 4, description: 'Sparkling fermented drink.' },
  salmon_kg: { id: 'salmon_kg', name: 'Fresh Salmon (Kg)', baseCost: 22, description: 'Top-quality Baltic salmon.' },
  energy_drink_can: { id: 'energy_drink_can', name: 'Energy Drink', baseCost: 2, description: 'Essential fuel for Teika programmers.' },
  
  // --- INGREDIENTI: FINE DINING & LUXURY ---
  premium_beef_kg: { id: 'premium_beef_kg', name: 'Premium Beef (Kg)', baseCost: 45, description: 'Dry-aged premium cuts.' },
  potatoes_kg: { id: 'potatoes_kg', name: 'Potatoes (Kg)', baseCost: 1, description: 'The staple food of all Latvia.' },
  craft_beer_keg: { id: 'craft_beer_keg', name: 'Craft Beer (Keg)', baseCost: 80, description: 'Keg of local IPA craft beer.' },
  caviar_tin: { id: 'caviar_tin', name: 'Beluga Caviar (Tin)', baseCost: 150, description: 'The height of luxury for Vecrīga.' },
  gold_leaf: { id: 'gold_leaf', name: 'Edible Gold Leaf', baseCost: 50, description: 'For when a normal dish is not enough.' },
  truffle_whole: { id: 'truffle_whole', name: 'Black Truffle (Whole)', baseCost: 90, description: 'Fine black truffle.' },
  champagne_bottle: { id: 'champagne_bottle', name: 'Vintage Champagne', baseCost: 120, description: 'For celebrating million-dollar deals.' },
  
  // --- INGREDIENTI: AIRPORT FAST FOOD ---
  burger_patty: { id: 'burger_patty', name: 'Frozen Patty', baseCost: 1.5, description: 'Burger patty ready for the quick grill.' },
  burger_bun: { id: 'burger_bun', name: 'Sesame Bun', baseCost: 0.5, description: 'Soft sesame bun.' },
};