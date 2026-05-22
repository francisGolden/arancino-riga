import { businessListData } from '#/db/businessList'
import type { BusinessConfig } from '#/types'
import { db } from '#/db/initDb'

export const buyBusiness = async (id: string) => {
  const match = businessListData.find((obj: BusinessConfig) => obj.id === id)

}
