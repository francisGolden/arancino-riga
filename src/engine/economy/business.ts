import { db } from '#/db/initDb'

export const checkPurchase = async (amount: number) => {
    // this function is used to check if a transaction such as the purchase of a business
    // can be executed or not based on money available
    const enoughMoney = db.data.money > amount
    if (enoughMoney) {
        return true
    }
    return false
}