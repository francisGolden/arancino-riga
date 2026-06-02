import type { ProductConfig } from "#/types";

export const PRODUCTS_CATALOG: Record<string, ProductConfig> = {
  // Arancini
  arancino_base: { id: 'arancino_base', name: 'Classic Arancino', baseSellingPrice: 6, description: 'The classic ragù arancino.' },
  arancino_latvian: { id: 'arancino_latvian', name: 'Latvian Arancino', baseSellingPrice: 8, description: 'Special edition filled with Biezpiens and dill.' },
  arancino_truffle: { id: 'arancino_truffle', name: 'Truffle Arancino', baseSellingPrice: 18, description: 'Gourmet truffle arancino.' },
  
  // Gelati
  scoop_vanilla: { id: 'scoop_vanilla', name: 'Vanilla Cone', baseSellingPrice: 4, description: 'Classic vanilla cone.' },
  scoop_chocolate: { id: 'scoop_chocolate', name: 'Chocolate Cone', baseSellingPrice: 5, description: 'Dark chocolate cone.' },
  
  // Caffetteria & Panetteria
  espresso: { id: 'espresso', name: 'Espresso', baseSellingPrice: 3, description: 'Short and intense coffee.' },
  cappuccino: { id: 'cappuccino', name: 'Cappuccino', baseSellingPrice: 4.5, description: 'Coffee with perfect milk foam.' },
  rupjmaize_loaf: { id: 'rupjmaize_loaf', name: 'Rupjmaize Loaf', baseSellingPrice: 7, description: 'Traditional dark rye bread loaf.' },
  cinnamon_roll: { id: 'cinnamon_roll', name: 'Cinnamon Roll', baseSellingPrice: 5, description: 'Warm and buttery cinnamon roll.' },
  
  // Pancakes
  pancake_sweet: { id: 'pancake_sweet', name: 'Honey Pancake', baseSellingPrice: 9, description: 'Sweet pancake drenched in local honey.' },
  pancake_savory: { id: 'pancake_savory', name: 'Bacon Pancake', baseSellingPrice: 11, description: 'Savory pancake for a hearty breakfast.' },
  
  // Hipster & Tech
  matcha_latte: { id: 'matcha_latte', name: 'Iced Matcha Latte', baseSellingPrice: 7, description: 'The favorite drink of Miera iela creatives.' },
  avocado_toast: { id: 'avocado_toast', name: 'Avocado Toast', baseSellingPrice: 12, description: 'A Sunday brunch must-have.' },
  poke_bowl: { id: 'poke_bowl', name: 'Salmon Poke Bowl', baseSellingPrice: 16, description: 'A healthy, energizing bowl for programmers.' },
  
  // Ristorazione & Lusso
  grilled_steak: { id: 'grilled_steak', name: 'Sunset Ribeye', baseSellingPrice: 65, description: 'Premium steak served by the river.' },
  beer_pint: { id: 'beer_pint', name: 'Craft Pint', baseSellingPrice: 8, description: 'A chilled pint of craft beer.' },
  truffle_risotto: { id: 'truffle_risotto', name: 'Gold Truffle Risotto', baseSellingPrice: 120, description: 'Truffle risotto decorated with gold leaf.' },
  caviar_blini: { id: 'caviar_blini', name: 'Caviar Blini', baseSellingPrice: 180, description: 'Small crêpes served with Beluga caviar.' },
  
  // Aeroporto
  airport_burger: { id: 'airport_burger', name: 'Terminal Burger', baseSellingPrice: 15, description: 'Airport surcharge included.' },
  travel_sandwich: { id: 'travel_sandwich', name: 'Flight Sandwich', baseSellingPrice: 9, description: 'Easy to eat at the gate.' }
};