export interface GameDb {
  gameStartedAt: number;
  lastSavedAt: number;
  money: number;
  ownedBusinesses: string[];
  inventory: Record<string, number>;
  inventories: Record<string, Record<string, number>>;
  businessEmployees: Record<string, string[]>
}

export type EmployeeRole = 'cook' | 'cashier' | 'barista'

export interface EmployeeConfig {
  id: string;
  name: string;
  roles: EmployeeRole[];
  description: string;
  baseWage: number;
  preferredBusinessTypes: BusinessType[];
}

export interface ElapsedTimeResult {
  elapsedTime: number;
  elapsedSeconds: number;
}

export interface MoneyState {
  money: number;
  increaseMoney: (amount: number) => void;
  decreaseMoney: (amount: number) => void;
  setMoney: (amount: number) => void;
  hydrateMoney: (savedAmount: number) => void;
}

export type BusinessType = 
  | 'street_food'
  | 'cafe_bakery'
  | 'restaurant'
  | 'luxury'
  | 'fast_food';

export interface BusinessConfig {
  id: string;
  baseCost: number;
  baseIncome: number;
  name: string;
  description: string;
  location: string;
  type: BusinessType;
  allowedItems: string[];
}

export interface BusinessListState {
  ownedBusinesses: string[];
  buyBusiness: (id: string, cost: number) => Promise<boolean>;
  sellBusiness: (id: string, cost: number) => Promise<boolean>;
  setBusinessList: (list: string[]) => void;
  hydrateBusinessList: (savedBusinesses: string[]) => void;
}

export interface InventoryState {
  inventory: Record<string, number>;
  craftProduct: (id: string, amount: number) => void;
  buyItem: (id: string, cost: number) => void;
  sellItem: (id: string, cost: number) => void;
  setInventory: (inventory: Record<string, number>) => void;
  hydrateInventory: (savedInventory: Record<string, number>) => void;
}

export interface InventoriesState {
  inventories: Record<string, Record<string, number>>;
  craftBusinessProduct: (recipeItemId: string, businessId: string, allowedItems: string[]) => void;
  buyItemForBusiness: (id: string, cost: number, businessId: string, allowedItems: string[]) => void;
  sellBusinessItem: (id: string, cost: number, businessId: string) => void;
  addBusinessToInventory: (businessId: string) => void;
  getAllowedRecipes: (allowedItems: string[], recipe_catalog: Record<string, RecipeConfig>) => RecipeConfig[];
  hydrateInventories: (savedInventories: Record<string, Record<string, number>>) => void;
}

export type ItemType = 'ingredient' | 'product';

export interface ItemConfig {
  id: string;
  name: string;
  type: ItemType;
  baseCost: number;
  description?: string;
}

export interface RecipeConfig {
  productId: string; // ID of finished product (must exist in inventoryList)
  ingredients: Record<string, number>; // Which ingredients are needed and how many
  yieldAmount: number; // How many products does this recipe yield?
  recipeName?: string
}