import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { db } from '#/db/initDb'
import { useMoney } from '#/store/currency'
import { useBusiness } from '#/store/business'
import { BUSINESS_CATALOG } from '#/db/businessList'
import { INVENTORY_CATALOG } from '#/db/inventoryList'
import { GameClock } from '#/components/gameClock'
import { useInventory } from '#/store/inventory'
import { useInventories } from '#/store/inventories'
import { RECIPE_CATALOG } from '#/db/recipeList'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const increaseMoney = useMoney((state) => state.increaseMoney)
  const setMoney = useMoney((state) => state.setMoney)
  const money = useMoney((state) => state.money)
  const buyBusiness = useBusiness((state) => state.buyBusiness)
  const sellBusiness = useBusiness((state) => state.sellBusiness)

  useEffect(() => {
    // This useEffect auto-saves the lastSavedAt property of the db
    // every 10 seconds.

    const AUTOSAVE_INTERVAL_MS = 10000

    const intervalId: number = window.setInterval(async (): Promise<void> => {
      try {
        await db.update((data) => {
          data.lastSavedAt = Date.now()
        })
        console.log('Game auto-saved.')
      } catch (error) {
        console.error('Auto-save failed', error)
      }
    }, AUTOSAVE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  console.log(INVENTORY_CATALOG.rice_kg)

  return (
    <div className="">
      <GameClock />
      <button onClick={() => increaseMoney(1)}>Money + 1</button>
      <button onClick={() => setMoney(1000)}>Reset money</button>
      <span>Money: {money}</span>
      <br />
      <br />
      <span>business</span>
      {BUSINESS_CATALOG.map(({ id, name, baseCost }) => {
        return (
          <div key={id}>
            <button onClick={() => buyBusiness(id, baseCost)}>
              buy {name}
            </button>
            <button onClick={() => sellBusiness(id, baseCost)}>
              sell {name}
            </button>
            <span>
              owned:{' '}
              {useBusiness
                .getState()
                .ownedBusinesses.some((businessId: string) => businessId === id)
                ? 'true'
                : 'false'}
            </span>
          </div>
        )
      })}
      <br />

      <div>
        <span>products</span>
        {Object.entries(RECIPE_CATALOG).map(([recipe]) => {
          return (
            <div key={recipe} id={recipe}>
              <span>{recipe}</span>
              <button
                onClick={() => useInventory.getState().craftProduct(recipe, 1)}
              >
                Create product
              </button>
              <span>
                owned:{' '}
                {useInventory.getState().inventory[
                  RECIPE_CATALOG[recipe].productId
                ]
                  ? 'true'
                  : 'false'}
              </span>
            </div>
          )
        })}
      </div>
      <br />
      <div>
        <span>ingredients</span>
        {Object.keys(INVENTORY_CATALOG).map((item) => {
          return (
            <div key={item}>
              <span>{item}</span>
              <button
                onClick={() =>
                  useInventory
                    .getState()
                    .buyItem(item, INVENTORY_CATALOG[item].baseCost)
                }
              >
                Buy item
              </button>
              <button
                onClick={() =>
                  useInventory
                    .getState()
                    .sellItem(item, INVENTORY_CATALOG[item].baseCost)
                }
              >
                Sell item
              </button>
              <span>
                qt:{' '}
                {useInventory.getState().inventory[item]
                  ? useInventory.getState().inventory[item]
                  : 0}
              </span>
              <div>
                <span>buy for business</span>
                {useBusiness.getState().ownedBusinesses.map((business) => {
                  return (<button key={business} onClick={() => useInventories.getState().buyItemForBusiness(item, INVENTORY_CATALOG[item].baseCost, business)}>{business}</button>)
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
