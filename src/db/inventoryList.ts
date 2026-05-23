import type { ItemConfig } from "#/types";

export const INVENTORY_CATALOG: Record<string, ItemConfig> = {
  // --- INGREDIENTI: ARANCINI & STREET FOOD ---
  rice_kg: { id: 'rice_kg', name: 'Arborio Rice (Kg)', type: 'ingredient', baseCost: 2, description: 'The perfect base for every arancino.' },
  saffron_g: { id: 'saffron_g', name: 'Saffron (g)', type: 'ingredient', baseCost: 15, description: 'Red gold. It gives arancini their iconic color.' },
  mozzarella_kg: { id: 'mozzarella_kg', name: 'Mozzarella (Kg)', type: 'ingredient', baseCost: 8, description: 'Stretchy and excellent quality.' },
  minced_meat_kg: { id: 'minced_meat_kg', name: 'Minced Meat (Kg)', type: 'ingredient', baseCost: 7, description: 'Ground meat for a perfect ragù.' },
  peas_kg: { id: 'peas_kg', name: 'Peas (Kg)', type: 'ingredient', baseCost: 3, description: 'Sweet peas, essential for the classic recipe.' },
  frying_oil_l: { id: 'frying_oil_l', name: 'Frying Oil (L)', type: 'ingredient', baseCost: 4, description: 'Seed oil resistant to high temperatures.' },
  breadcrumbs_kg: { id: 'breadcrumbs_kg', name: 'Breadcrumbs (Kg)', type: 'ingredient', baseCost: 2, description: 'For a crispy coating that goes crunch.' },
  biezpiens_kg: { id: 'biezpiens_kg', name: 'Biezpiens (Kg)', type: 'ingredient', baseCost: 5, description: 'Latvian curd cheese flakes for fusion recipes.' },
  
  // --- INGREDIENTI: GELATERIA (Uzvaras Parks) ---
  milk_l: { id: 'milk_l', name: 'Fresh Milk (L)', type: 'ingredient', baseCost: 1, description: 'Whole milk from Latvian farms.' },
  sugar_kg: { id: 'sugar_kg', name: 'Sugar (Kg)', type: 'ingredient', baseCost: 1, description: 'Refined white sugar.' },
  vanilla_bean: { id: 'vanilla_bean', name: 'Vanilla Bean', type: 'ingredient', baseCost: 12, description: 'Madagascar vanilla pod.' },
  choco_chips_kg: { id: 'choco_chips_kg', name: 'Chocolate Chips (Kg)', type: 'ingredient', baseCost: 9, description: 'Dark chocolate chips.' },
  ice_cream_cone: { id: 'ice_cream_cone', name: 'Wafer Cone', type: 'ingredient', baseCost: 0.5, description: 'Crispy wafer cone.' },
  
  // --- INGREDIENTI: CAFFETTERIA & PANIFICIO ---
  coffee_beans_kg: { id: 'coffee_beans_kg', name: 'Coffee Beans (Kg)', type: 'ingredient', baseCost: 18, description: 'Dark-roasted Arabica beans.' },
  flour_kg: { id: 'flour_kg', name: 'Wheat Flour (Kg)', type: 'ingredient', baseCost: 1, description: 'Type 00 flour.' },
  rye_flour_kg: { id: 'rye_flour_kg', name: 'Rye Flour (Kg)', type: 'ingredient', baseCost: 2, description: 'Rye flour for authentic Latvian bread.' },
  yeast_g: { id: 'yeast_g', name: 'Fresh Yeast (g)', type: 'ingredient', baseCost: 1, description: 'Fresh brewer\'s yeast.' },
  butter_kg: { id: 'butter_kg', name: 'Butter (Kg)', type: 'ingredient', baseCost: 6, description: 'Rich and creamy butter.' },
  eggs_dozen: { id: 'eggs_dozen', name: 'Eggs (Dozen)', type: 'ingredient', baseCost: 3, description: 'Fresh eggs from free-range hens.' },
  honey_jar: { id: 'honey_jar', name: 'Local Honey (Jar)', type: 'ingredient', baseCost: 8, description: 'Honey from Latvian forests.' },
  bacon_kg: { id: 'bacon_kg', name: 'Bacon (Kg)', type: 'ingredient', baseCost: 10, description: 'Wood-smoked bacon.' },
  
  // --- INGREDIENTI: HIPSTER CAFE & BISTRO ---
  matcha_powder_g: { id: 'matcha_powder_g', name: 'Matcha Powder (g)', type: 'ingredient', baseCost: 25, description: 'Ceremonial-grade Japanese green tea powder.' },
  oat_milk_l: { id: 'oat_milk_l', name: 'Oat Milk (L)', type: 'ingredient', baseCost: 3, description: 'A popular plant-based alternative.' },
  avocado_unit: { id: 'avocado_unit', name: 'Avocado', type: 'ingredient', baseCost: 2, description: 'Soft and ready to spread.' },
  kombucha_bottle: { id: 'kombucha_bottle', name: 'Raw Kombucha', type: 'ingredient', baseCost: 4, description: 'Sparkling fermented drink.' },
  salmon_kg: { id: 'salmon_kg', name: 'Fresh Salmon (Kg)', type: 'ingredient', baseCost: 22, description: 'Top-quality Baltic salmon.' },
  energy_drink_can: { id: 'energy_drink_can', name: 'Energy Drink', type: 'ingredient', baseCost: 2, description: 'Essential fuel for Teika programmers.' },
  
  // --- INGREDIENTI: FINE DINING & LUXURY ---
  premium_beef_kg: { id: 'premium_beef_kg', name: 'Premium Beef (Kg)', type: 'ingredient', baseCost: 45, description: 'Dry-aged premium cuts.' },
  potatoes_kg: { id: 'potatoes_kg', name: 'Potatoes (Kg)', type: 'ingredient', baseCost: 1, description: 'The staple food of all Latvia.' },
  craft_beer_keg: { id: 'craft_beer_keg', name: 'Craft Beer (Keg)', type: 'ingredient', baseCost: 80, description: 'Keg of local IPA craft beer.' },
  caviar_tin: { id: 'caviar_tin', name: 'Beluga Caviar (Tin)', type: 'ingredient', baseCost: 150, description: 'The height of luxury for Vecrīga.' },
  gold_leaf: { id: 'gold_leaf', name: 'Edible Gold Leaf', type: 'ingredient', baseCost: 50, description: 'For when a normal dish is not enough.' },
  truffle_whole: { id: 'truffle_whole', name: 'Black Truffle (Whole)', type: 'ingredient', baseCost: 90, description: 'Fine black truffle.' },
  champagne_bottle: { id: 'champagne_bottle', name: 'Vintage Champagne', type: 'ingredient', baseCost: 120, description: 'For celebrating million-dollar deals.' },
  
  // --- INGREDIENTI: AIRPORT FAST FOOD ---
  burger_patty: { id: 'burger_patty', name: 'Frozen Patty', type: 'ingredient', baseCost: 1.5, description: 'Burger patty ready for the quick grill.' },
  burger_bun: { id: 'burger_bun', name: 'Sesame Bun', type: 'ingredient', baseCost: 0.5, description: 'Soft sesame bun.' },

  // ==========================================
  // --- PRODOTTI FINITI (Da vendere o servire) ---
  // ==========================================
  
  // Arancini
  arancino_base: { id: 'arancino_base', name: 'Classic Arancino', type: 'product', baseCost: 6, description: 'The classic ragù arancino.' },
  arancino_latvian: { id: 'arancino_latvian', name: 'Latvian Arancino', type: 'product', baseCost: 8, description: 'Special edition filled with Biezpiens and dill.' },
  arancino_truffle: { id: 'arancino_truffle', name: 'Truffle Arancino', type: 'product', baseCost: 18, description: 'Gourmet truffle arancino.' },
  
  // Gelati
  scoop_vanilla: { id: 'scoop_vanilla', name: 'Vanilla Cone', type: 'product', baseCost: 4, description: 'Classic vanilla cone.' },
  scoop_chocolate: { id: 'scoop_chocolate', name: 'Chocolate Cone', type: 'product', baseCost: 5, description: 'Dark chocolate cone.' },
  
  // Caffetteria & Panetteria
  espresso: { id: 'espresso', name: 'Espresso', type: 'product', baseCost: 3, description: 'Short and intense coffee.' },
  cappuccino: { id: 'cappuccino', name: 'Cappuccino', type: 'product', baseCost: 4.5, description: 'Coffee with perfect milk foam.' },
  rupjmaize_loaf: { id: 'rupjmaize_loaf', name: 'Rupjmaize Loaf', type: 'product', baseCost: 7, description: 'Traditional dark rye bread loaf.' },
  cinnamon_roll: { id: 'cinnamon_roll', name: 'Cinnamon Roll', type: 'product', baseCost: 5, description: 'Warm and buttery cinnamon roll.' },
  
  // Pancakes
  pancake_sweet: { id: 'pancake_sweet', name: 'Honey Pancake', type: 'product', baseCost: 9, description: 'Sweet pancake drenched in local honey.' },
  pancake_savory: { id: 'pancake_savory', name: 'Bacon Pancake', type: 'product', baseCost: 11, description: 'Savory pancake for a hearty breakfast.' },
  
  // Hipster & Tech
  matcha_latte: { id: 'matcha_latte', name: 'Iced Matcha Latte', type: 'product', baseCost: 7, description: 'The favorite drink of Miera iela creatives.' },
  avocado_toast: { id: 'avocado_toast', name: 'Avocado Toast', type: 'product', baseCost: 12, description: 'A Sunday brunch must-have.' },
  poke_bowl: { id: 'poke_bowl', name: 'Salmon Poke Bowl', type: 'product', baseCost: 16, description: 'A healthy, energizing bowl for programmers.' },
  
  // Ristorazione & Lusso
  grilled_steak: { id: 'grilled_steak', name: 'Sunset Ribeye', type: 'product', baseCost: 65, description: 'Premium steak served by the river.' },
  beer_pint: { id: 'beer_pint', name: 'Craft Pint', type: 'product', baseCost: 8, description: 'A chilled pint of craft beer.' },
  truffle_risotto: { id: 'truffle_risotto', name: 'Gold Truffle Risotto', type: 'product', baseCost: 120, description: 'Truffle risotto decorated with gold leaf.' },
  caviar_blini: { id: 'caviar_blini', name: 'Caviar Blini', type: 'product', baseCost: 180, description: 'Small crêpes served with Beluga caviar.' },
  
  // Aeroporto
  airport_burger: { id: 'airport_burger', name: 'Terminal Burger', type: 'product', baseCost: 15, description: 'Airport surcharge included.' },
  travel_sandwich: { id: 'travel_sandwich', name: 'Flight Sandwich', type: 'product', baseCost: 9, description: 'Easy to eat at the gate.' }
};