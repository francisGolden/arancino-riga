import { createFileRoute } from '@tanstack/react-router'
import { useInventories } from '#/store/inventories'
import { GameClock } from '#/components/gameClock'
import { INVENTORY_CATALOG } from '#/db/inventoryList'
import { BUSINESS_CATALOG } from '#/db/businessList'
import { useMoney } from '#/store/currency'

export const Route = createFileRoute('/business/$businessId')({
  component: RouteComponent,
})

function RouteComponent() {
  const money = useMoney((state) => state.money)
  const { businessId } = Route.useParams()
  const businessInventory = useInventories(
    (state) => state.inventories[businessId],
  )
  const objectInventoryIterable = Object.entries(businessInventory)
  const allowedItems = BUSINESS_CATALOG.find(
    (business) => business.id === businessId,
  )?.allowedItems

  const buyItemForBusiness = useInventories((state) => state.buyItemForBusiness)

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
        <ul>{}</ul>
      </div>
      <GameClock />
    </div>
  )
}
