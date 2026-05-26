import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useInventories } from '#/store/inventories'
import { GameClock } from '#/components/gameClock'
import { INVENTORY_CATALOG } from '#/db/inventoryList'
import { BUSINESS_CATALOG } from '#/db/businessList'
import { useMoney } from '#/store/currency'
import { RECIPE_CATALOG } from '#/db/recipeList'
import type { EmployeeConfig, RecipeConfig } from '#/types'
import { useBusiness } from '#/store/business'
import { useEmployees } from '#/store/employees'

export const Route = createFileRoute('/business/$businessId')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const money = useMoney((state) => state.money)
  const { businessId } = Route.useParams()
  const businessInventory = useInventories(
    (state) => state.inventories[businessId],
  )

  const businessCatalogObject = BUSINESS_CATALOG.find(
    (business) => business.id === businessId,
  )

  const objectInventoryIterable = Object.entries(businessInventory)
  const allowedItems = businessCatalogObject?.allowedItems
  const allowedRecipes: RecipeConfig[] = useInventories
    .getState()
    .getAllowedRecipes(allowedItems || [], RECIPE_CATALOG)

  const compatibleEmployees = useEmployees
    .getState()
    .getCompatibleEmployees(businessId, businessCatalogObject?.type || '')

  const buyItemForBusiness = useInventories((state) => state.buyItemForBusiness)
  const sellBusiness = useBusiness((state) => state.sellBusiness)
  const craftBusinessProduct = useInventories(
    (state) => state.craftBusinessProduct,
  )

  const handleSellBusiness = async (id: string, cost: number) => {
    const businessSaleResult = await sellBusiness(id, cost)
    if (!businessSaleResult) return
    navigate({
      to: '/',
    })
  }

  return (
    <div>
      <h1>{businessId}</h1>
      <h4>{businessCatalogObject?.type}</h4>
      <span>{money} money</span>
      <div>
        <h4>Business Inventory</h4>
        <ul>
          {objectInventoryIterable.map(([item, amount], index) => {
            return (
              <li key={index}>
                {item}: {amount}
              </li>
            )
          })}
        </ul>
      </div>
      <div>
        <h4>Employees</h4>
        <button
          onClick={() =>
            useEmployees
              .getState()
              .getCompatibleEmployees(
                businessId,
                businessCatalogObject?.type || '',
              )
          }
        >
          Get Compatible Employees
        </button>
        <button onClick={() => useEmployees.getState().hireEmployee}>
          Hire Employee
        </button>
        <ul></ul>
        {compatibleEmployees.map((compatibleEmployee: EmployeeConfig) => {
          return (
            <li key={compatibleEmployee.id}>
              <button>Hire {compatibleEmployee.name}</button>
            </li>
          )
        })}
      </div>
      <div>
        <h4>Buy from supplier</h4>
        <ul>
          {allowedItems?.map((allowedItem, index) => {
            return (
              <li key={index}>
                <span>{allowedItem}</span>
                <button
                  onClick={() =>
                    buyItemForBusiness(
                      allowedItem,
                      INVENTORY_CATALOG[allowedItem].baseCost,
                      businessId,
                      allowedItems,
                    )
                  }
                >
                  buy
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div>
        <h4>Craft</h4>
        <ul>
          {allowedRecipes.map((allowedRecipe: RecipeConfig, index: number) => {
            return (
              <li key={index}>
                <span>{allowedRecipe.productId}</span>
                <button
                  onClick={() =>
                    craftBusinessProduct(
                      allowedRecipe.recipeName || '',
                      businessId,
                      allowedItems || [],
                    )
                  }
                >
                  craft {allowedRecipe.yieldAmount}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div>
        <button
          onClick={() =>
            handleSellBusiness(businessId, businessCatalogObject?.baseCost || 0)
          }
        >
          Sell this business
        </button>
      </div>
      <GameClock />
    </div>
  )
}
