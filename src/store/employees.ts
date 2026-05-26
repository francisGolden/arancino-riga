import { create } from 'zustand'
import { db } from '#/db/initDb'
import { EMPLOYEES_CATALOG } from '#/db/employeesCatalog'
import type { EmployeeConfig } from '#/types'
import { useMoney } from './currency'

interface EmployeesState {
  businessEmployees: Record<string, string[]>
  getBusinessEmployees: (businessId: string) => string[]
  getCompatibleEmployees: (
    businessId: string,
    businessType: string,
  ) => EmployeeConfig[]
  hireEmployee: (
    businessId: string,
    employeeId: string,
    employeeWage: number,
  ) => Promise<boolean>
  fireEmployee: (
    businessId: string,
    employeeId: string,
  ) => Promise<boolean>
  addBusinessToEmployees: (businessId: string) => Promise<boolean>;
  getBusinessEmployeesTotalWage: (businessId: string) => number;
  payWages: (businessId: string) => Promise<boolean>;
  hydrateEmployees: (savedEmployees: Record<string, string[]>) => void
}

const updateDbEmployees = async (
  newBusinessEmployees: Record<string, string[]>,
): Promise<void> => {
  try {
    await db.update((data) => (data.businessEmployees = newBusinessEmployees))
  } catch (error) {
    console.error('could not update business employees', error)
  }
}

export const useEmployees = create<EmployeesState>((set, get) => ({
  businessEmployees: {
  },
  getBusinessEmployees: (businessId: string): string[] => {
    const currentBusinessEmployees = get().businessEmployees
    return currentBusinessEmployees[businessId]
  },
  getCompatibleEmployees: (
    businessId: string,
    businessType: string,
  ): EmployeeConfig[] => {
    const businessEmployees = get().businessEmployees
    const compatibleEmployees = []
    for (const [id, object] of Object.entries(EMPLOYEES_CATALOG)) {
      if (
        object.preferredBusinessTypes.some(
          (preferredBusinessType) => preferredBusinessType === businessType,
        )
      ) {
        if (businessEmployees[businessId].includes(id)) {
        } else {
          compatibleEmployees.push(object)
        }
      }
    }
    return compatibleEmployees
  },
  hireEmployee: async (
    businessId: string,
    employeeId: string,
    employeeWage: number,
  ): Promise<boolean> => {
    console.log('hire', businessId, employeeId)
    const currentBusinessEmployees = get().businessEmployees
    if (currentBusinessEmployees[businessId].includes(employeeId)) return false
    if (useMoney.getState().money < employeeWage) return false

    console.log('passed checks')
    const businessEmployeesCopy = { ...currentBusinessEmployees }
    businessEmployeesCopy[businessId] = [
      ...businessEmployeesCopy[businessId],
      employeeId,
    ]

    set(() => ({ businessEmployees: businessEmployeesCopy }))

    try {
      await updateDbEmployees(businessEmployeesCopy)
      return true
    } catch (error) {
      console.error('could not hire employee')
      set(() => ({ businessEmployees: currentBusinessEmployees }))
      return false
    }
  },
  fireEmployee: async (
    businessId: string,
    employeeId: string,
  ): Promise<boolean> => {
    console.log('fire', businessId, employeeId)
    const currentBusinessEmployees = get().businessEmployees
    if (!currentBusinessEmployees[businessId].includes(employeeId)) return false

    console.log('passed checks')
    const businessEmployeesCopy = { ...currentBusinessEmployees }
    businessEmployeesCopy[businessId] = currentBusinessEmployees[businessId].filter((employee) => employee !== employeeId)

    set(() => ({ businessEmployees: businessEmployeesCopy}))

    try {
      await updateDbEmployees(businessEmployeesCopy)
      return true
    } catch (error) {
      console.error('could not fire employee')
      set(() => ({ businessEmployees: currentBusinessEmployees }))
      return false
    }
  },
  addBusinessToEmployees: async (businessId: string) => {
    const currentEmployees = get().businessEmployees

    const currentEmployeesCopy = { ...currentEmployees }
    currentEmployeesCopy[businessId] = []
    set(() => ({ businessEmployees: currentEmployeesCopy }))

    try {
      await updateDbEmployees(currentEmployeesCopy)
      return true
    } catch (error) {
      set(() => ({ businessEmployees: currentEmployees }))
      console.error('could not add business to employees', error)
      return false
    }
  },
  getBusinessEmployeesTotalWage: (businessId: string) => {
    console.log(businessId)
    const currentBusinessEmployees = get().businessEmployees[businessId]
    let sum = 0
    for (const employee of currentBusinessEmployees) {
        console.log(EMPLOYEES_CATALOG[employee].baseWage)
        sum += EMPLOYEES_CATALOG[employee].baseWage
    }
    return sum
  },
  payWages: async (businessId: string): Promise<boolean> => {
    const totalWages = get().getBusinessEmployeesTotalWage(businessId)
    const moneyAvailable = useMoney.getState().money

    if (moneyAvailable < totalWages) {
        console.log('not enough money to pay wages')
        return false
    }

    try {
        await useMoney.getState().decreaseMoney(totalWages)
        return true
    } catch (error) {
        console.error('could not update', error)
        return false
    }
  },
  hydrateEmployees: (savedEmployees: Record<string, string[]>) => {
    set(() => ({ businessEmployees: savedEmployees }))
  },
}))
