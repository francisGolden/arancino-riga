import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useInventories } from '#/store/inventories'
import { GameClock } from '#/components/gameClock'
import { INVENTORY_CATALOG } from '#/db/inventoryList'
import { BUSINESS_CATALOG } from '#/db/businessList'
import { useMoney } from '#/store/currency'
import { RECIPE_CATALOG } from '#/db/recipeList'
import type { RecipeConfig } from '#/types'
import { useBusiness } from '#/store/business'

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
  const objectInventoryIterable = Object.entries(businessInventory)
  const allowedItems = BUSINESS_CATALOG.find(
    (business) => business.id === businessId,
  )?.allowedItems
  const allowedRecipes: RecipeConfig[] = useInventories
    .getState()
    .getAllowedRecipes(allowedItems || [], RECIPE_CATALOG)

  const buyItemForBusiness = useInventories((state) => state.buyItemForBusiness)
  const sellBusiness = useBusiness((state) => state.sellBusiness)
  const craftBusinessProduct = useInventories(
    (state) => state.craftBusinessProduct,
  )

  const handleSellBusiness = async (id: string, cost: number) => {
    const businessSaleResult = await sellBusiness(id, cost)
    if (!businessSaleResult) return
    navigate({
        to: "/"
    })
  }

  return (
    <div>
      <h1>{businessId}</h1>
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
            handleSellBusiness(
              businessId,
              BUSINESS_CATALOG.find((business) => business.id === businessId)
                ?.baseCost || 0,
            )
          }
        >
          Sell this business
        </button>
      </div>
      <GameClock />
    </div>
  )
}
