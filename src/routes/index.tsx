import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { db } from '#/db/initDb'
import { useMoney } from '#/store/currency'
import { useBusiness } from '#/store/business'
import { businessListData } from '#/db/businessList'
import { inventoryListData } from '#/db/inventoryList'
import { GameClock } from '#/components/gameClock'
import { useInventory } from '#/store/inventory'

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

  console.log(inventoryListData.rice_kg)

  return (
    <div className="">
      <GameClock />
      <button onClick={() => increaseMoney(1)}>Money + 1</button>
      <button onClick={() => setMoney(1000)}>Reset money</button>
      <span>Money: {money}</span>
      <br />
      <br />
      <span>business</span>
      {businessListData.map(({ id, name, baseCost }) => {
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
        <span>ingredients</span>
        {Object.keys(inventoryListData).map((item) => {
          return (
            <div key={item}>
              <span>{item}</span>
              <button onClick={() => useInventory.getState().buyItem(item, inventoryListData[item].baseCost)}>Buy item</button>
              <button onClick={() => useInventory.getState().sellItem(item, inventoryListData[item].baseCost)}>Sell item</button>
              <span>{useInventory.getState().inventory[item] ? 'owned' : 'not owned'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
