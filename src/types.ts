export interface GameDb {
  gameStartedAt: number
  lastSavedAt: number
  money: number
  ownedBusinesses: string[]
  inventory: Record<string, number>
  inventories: Record<string, Record<string, number>>
  businessEmployees: Record<string, string[]>
  pendingBusinessOrders: Record<string, string[]>
}

export type EmployeeRole = 'cook' | 'cashier' | 'barista' | 'pastry chef'

export interface WorkRate {
  crafting: number;
  selling: number;
}

export interface EmployeeConfig {
  id: string
  name: string
  roles: EmployeeRole[]
  description: string
  baseWage: number
  preferredBusinessTypes: BusinessType[]
  workRate: WorkRate;
}

export interface ElapsedTimeResult {
  elapsedTime: number
  elapsedSeconds: number
}

export interface MoneyState {
  money: number
  increaseMoney: (amount: number) => Promise<boolean>
  decreaseMoney: (amount: number) => Promise<boolean>
  setMoney: (amount: number) => void
  hydrateMoney: (savedAmount: number) => void
}

export type BusinessType =
  | 'street_food'
  | 'cafe_bakery'
  | 'restaurant'
  | 'luxury'
  | 'fast_food'

export interface BusinessConfig {
  id: string
  baseCost: number
  baseIncome: number
  baseOrderRate: number
  name: string
  description: string
  location: string
  type: BusinessType
  allowedItems: string[]
}

export interface BusinessListState {
  ownedBusinesses: string[]
  buyBusiness: (id: string, cost: number) => Promise<boolean>
  sellBusiness: (id: string, cost: number) => Promise<boolean>
  setBusinessList: (list: string[]) => void
  hydrateBusinessList: (savedBusinesses: string[]) => void
}

export interface InventoryState {
  inventory: Record<string, number>
  craftProduct: (id: string, amount: number) => void
  buyItem: (id: string, cost: number) => void
  sellItem: (id: string, cost: number) => void
  setInventory: (inventory: Record<string, number>) => void
  hydrateInventory: (savedInventory: Record<string, number>) => void
}

export interface InventoriesState {
  inventories: Record<string, Record<string, number>>
  craftBusinessProduct: (
    recipeItemId: string,
    businessId: string,
    allowedItems: string[],
    requiredRole: EmployeeRole,
  ) => void
  buyRecipeIngredients: (
    recipeItemId: string,
    allowedItems: string[],
    businessId: string,
  ) => Promise<boolean>
  buyItemForBusiness: (
    id: string,
    cost: number,
    businessId: string,
    allowedItems: string[],
    amount?: number,
  ) => Promise<boolean>
  sellBusinessItem: (id: string, cost: number, businessId: string) => void
  addBusinessToInventory: (businessId: string) => void
  getAllowedRecipes: (
    allowedItems: string[],
    recipe_catalog: Record<string, RecipeConfig>,
  ) => RecipeConfig[]
  hydrateInventories: (
    savedInventories: Record<string, Record<string, number>>,
  ) => void
}

export interface IngredientConfig {
  id: string
  name: string
  baseCost: number
  description?: string
}

export interface ProductConfig {
  id: string
  name: string
  description?: string
  baseSellingPrice: number
}

export interface RecipeConfig {
  productId: string // ID of finished product (must exist in inventoryList)
  ingredients: Record<string, number> // Which ingredients are needed and how many
  yieldAmount: number // How many products does this recipe yield?
  recipeName?: string
  requiredRole: EmployeeRole
}

export interface OrdersState {
  pendingBusinessOrders: Record<string, string[]>
  getPendingBusinessOrders: (businessId: string) => string[]
  addBusinessToPendingBusinessOrders: (businessId: string) => Promise<void>
  removeBusinessFromOrders: (businessId: string) => Promise<void>
  addOrder: (businessId: string, productId: string) => Promise<boolean>
  fulfillOrder: (businessId: string, productId: string) => Promise<boolean>
  hydrateOrders: (savedPendingBusinessOrders: Record<string, string[]>) => void
}
