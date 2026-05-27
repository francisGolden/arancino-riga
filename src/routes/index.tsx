import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { db } from '#/db/initDb'
import { useMoney } from '#/store/currency'
import { useBusiness } from '#/store/business'
import { BUSINESS_CATALOG } from '#/db/businessList'
import { INVENTORY_CATALOG } from '#/db/inventoryList'
import { GameClock } from '#/components/gameClock'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const navigate = useNavigate()
  const increaseMoney = useMoney((state) => state.increaseMoney)
  const setMoney = useMoney((state) => state.setMoney)
  const money = useMoney((state) => state.money)
  const buyBusiness = useBusiness((state) => state.buyBusiness)
  const sellBusiness = useBusiness((state) => state.sellBusiness)

  const handleBuyBusiness = async (businessId: string, cost: number) => {
    const buyBusinessResult = await buyBusiness(businessId, cost)
    if (!buyBusinessResult) return
    navigate({
      to: "/business/$businessId",
      params: { businessId: businessId }
    })
  }

  const ownedBusinesses = useBusiness((state) => state.ownedBusinesses)

  console.log(INVENTORY_CATALOG.rice_kg)

  return (
    <div className="">
      <GameClock />
      <button onClick={() => increaseMoney(1)}>Money + 1</button>
      <button onClick={() => setMoney(1000)}>Reset money</button>
      <span>Money: {money}</span>
      <br />
      <div>
        <span>My businesses</span>
        <ul>
          {ownedBusinesses.map((business, index) => {
            return (
              <li key={index}>
                <Link to={'/business/' + business}>{business}</Link>
              </li>
            )
          })}
        </ul>
      </div>
      <br />
      <span>business</span>
      {BUSINESS_CATALOG.map(({ id, name, baseCost }) => {
        return (
          <div key={id}>
            <button onClick={() => handleBuyBusiness(id, baseCost)}>
              buy {name}
            </button>
            <button onClick={() => sellBusiness(id, baseCost)}>
              sell {name}
            </button>
            <span>
              owned:{' '}
              {ownedBusinesses.some((businessId: string) => businessId === id)
                ? 'true'
                : 'false'}
            </span>
          </div>
        )
      })}
      <br />
    </div>
  )
}
