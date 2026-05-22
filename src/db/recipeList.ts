import type { RecipeConfig } from '#/types'

export const RECIPE_CATALOG: Record<string, RecipeConfig> = {
  // ==========================================
  // 1. RICETTE BASE (Singole / Piccoli Lotti)
  // ==========================================

  arancino_base_recipe: {
    productId: 'arancino_base',
    ingredients: {
      rice_kg: 1,
      saffron_g: 1,
      minced_meat_kg: 1,
      peas_kg: 1,
      frying_oil_l: 1,
      breadcrumbs_kg: 1,
    },
    yieldAmount: 15,
  },

  arancino_latvian_recipe: {
    productId: 'arancino_latvian',
    ingredients: {
      rice_kg: 1,
      saffron_g: 1,
      biezpiens_kg: 1,
      frying_oil_l: 1,
      breadcrumbs_kg: 1,
    },
    yieldAmount: 15,
  },

  arancino_truffle_recipe: {
    productId: 'arancino_truffle',
    ingredients: {
      rice_kg: 1,
      truffle_whole: 1,
      premium_beef_kg: 1,
      frying_oil_l: 1,
      breadcrumbs_kg: 1,
    },
    yieldAmount: 10,
  },

  scoop_vanilla_recipe: {
    productId: 'scoop_vanilla',
    ingredients: {
      milk_l: 1,
      sugar_kg: 1,
      vanilla_bean: 1,
      ice_cream_cone: 20,
    },
    yieldAmount: 20,
  },

  scoop_chocolate_recipe: {
    productId: 'scoop_chocolate',
    ingredients: {
      milk_l: 1,
      sugar_kg: 1,
      choco_chips_kg: 1,
      ice_cream_cone: 20,
    },
    yieldAmount: 20,
  },

  espresso_recipe: {
    productId: 'espresso',
    ingredients: { coffee_beans_kg: 1 },
    yieldAmount: 100, // 1kg di caffè fa 100 espressi
  },

  cappuccino_recipe: {
    productId: 'cappuccino',
    ingredients: { coffee_beans_kg: 1, milk_l: 2 },
    yieldAmount: 50,
  },

  rupjmaize_loaf_recipe: {
    productId: 'rupjmaize_loaf',
    ingredients: { rye_flour_kg: 2, yeast_g: 10, sugar_kg: 1 },
    yieldAmount: 5,
  },

  cinnamon_roll_recipe: {
    productId: 'cinnamon_roll',
    ingredients: {
      flour_kg: 1,
      butter_kg: 1,
      sugar_kg: 1,
      yeast_g: 10,
      milk_l: 1,
    },
    yieldAmount: 12,
  },

  pancake_sweet_recipe: {
    productId: 'pancake_sweet',
    ingredients: {
      flour_kg: 1,
      eggs_dozen: 1,
      milk_l: 1,
      butter_kg: 1,
      honey_jar: 1,
    },
    yieldAmount: 10,
  },

  pancake_savory_recipe: {
    productId: 'pancake_savory',
    ingredients: {
      flour_kg: 1,
      eggs_dozen: 1,
      milk_l: 1,
      butter_kg: 1,
      bacon_kg: 1,
    },
    yieldAmount: 10,
  },

  matcha_latte_recipe: {
    productId: 'matcha_latte',
    ingredients: { matcha_powder_g: 10, oat_milk_l: 2 },
    yieldAmount: 10,
  },

  // Catena di produzione: Usa il Rupjmaize appena sfornato come ingrediente!
  avocado_toast_recipe: {
    productId: 'avocado_toast',
    ingredients: { rupjmaize_loaf: 1, avocado_unit: 4, eggs_dozen: 1 },
    yieldAmount: 4,
  },

  poke_bowl_recipe: {
    productId: 'poke_bowl',
    ingredients: { salmon_kg: 1, rice_kg: 1, avocado_unit: 2 },
    yieldAmount: 5,
  },

  grilled_steak_recipe: {
    productId: 'grilled_steak',
    ingredients: { premium_beef_kg: 2, potatoes_kg: 3, butter_kg: 1 },
    yieldAmount: 4,
  },

  // 1 Fusto di birra -> 80 pinte
  beer_pint_recipe: {
    productId: 'beer_pint',
    ingredients: { craft_beer_keg: 1 },
    yieldAmount: 80,
  },

  truffle_risotto_recipe: {
    productId: 'truffle_risotto',
    ingredients: { rice_kg: 2, truffle_whole: 1, butter_kg: 1, gold_leaf: 1 },
    yieldAmount: 8,
  },

  caviar_blini_recipe: {
    productId: 'caviar_blini',
    ingredients: { flour_kg: 1, eggs_dozen: 1, milk_l: 1, caviar_tin: 1 },
    yieldAmount: 15,
  },

  airport_burger_recipe: {
    productId: 'airport_burger',
    ingredients: { burger_patty: 10, burger_bun: 10, bacon_kg: 1 },
    yieldAmount: 10,
  },

  travel_sandwich_recipe: {
    productId: 'travel_sandwich',
    ingredients: { rupjmaize_loaf: 1, salmon_kg: 1, eggs_dozen: 1 },
    yieldAmount: 6,
  },

  // ==========================================
  // 2. RICETTE BATCH (Produzione Industriale End-Game)
  // ==========================================

  arancino_base_batch: {
    productId: 'arancino_base',
    ingredients: {
      rice_kg: 10,
      saffron_g: 10,
      minced_meat_kg: 10,
      peas_kg: 10,
      frying_oil_l: 10,
      breadcrumbs_kg: 10,
    },
    yieldAmount: 150, // Moltiplicatore 10x
  },

  arancino_latvian_batch: {
    productId: 'arancino_latvian',
    ingredients: {
      rice_kg: 10,
      saffron_g: 10,
      biezpiens_kg: 10,
      frying_oil_l: 10,
      breadcrumbs_kg: 10,
    },
    yieldAmount: 150,
  },

  scoop_vanilla_batch: {
    productId: 'scoop_vanilla',
    ingredients: {
      milk_l: 10,
      sugar_kg: 10,
      vanilla_bean: 10,
      ice_cream_cone: 200,
    },
    yieldAmount: 200,
  },

  espresso_industrial: {
    productId: 'espresso',
    ingredients: { coffee_beans_kg: 10 },
    yieldAmount: 1000, // La gioia di Teika
  },

  cappuccino_industrial: {
    productId: 'cappuccino',
    ingredients: { coffee_beans_kg: 10, milk_l: 20 },
    yieldAmount: 500,
  },

  cinnamon_roll_batch: {
    productId: 'cinnamon_roll',
    ingredients: {
      flour_kg: 10,
      butter_kg: 10,
      sugar_kg: 10,
      yeast_g: 100,
      milk_l: 10,
    },
    yieldAmount: 120,
  },

  beer_festival_kegs: {
    productId: 'beer_pint',
    ingredients: { craft_beer_keg: 10 },
    yieldAmount: 800, // Perfetto per le serate estive ad Andrejosta
  },

  airport_burger_batch: {
    productId: 'airport_burger',
    ingredients: { burger_patty: 100, burger_bun: 100, bacon_kg: 10 },
    yieldAmount: 100,
  },

  // ==========================================
  // 3. RICETTE ALTERNATIVE (Sostituzione Ingredienti)
  // ==========================================

  // Una variante dell'Avocado Toast che usa la farina per fare il pane al momento (più costoso, ma salta un passaggio)
  avocado_toast_from_scratch: {
    productId: 'avocado_toast',
    ingredients: {
      rye_flour_kg: 1,
      yeast_g: 5,
      avocado_unit: 4,
      eggs_dozen: 1,
    },
    yieldAmount: 4,
  },

  // Un arancino gourmet che usa il formaggio fuso al posto dei piselli
  arancino_base_cheesy: {
    productId: 'arancino_base',
    ingredients: {
      rice_kg: 1,
      saffron_g: 1,
      minced_meat_kg: 1,
      mozzarella_kg: 1,
      frying_oil_l: 1,
      breadcrumbs_kg: 1,
    },
    yieldAmount: 15,
  },
}
