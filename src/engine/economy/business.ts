import { businessListData } from "#/db/businessList"
import type { BusinessConfig } from "#/types"

export const buyBusiness = async (
  id: string,
) => {
    console.log(id)
    const match = businessListData.find((obj: BusinessConfig) => obj.id === id)
    console.log(match?.name)
}
