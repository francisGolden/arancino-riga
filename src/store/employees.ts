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
}

export const useEmployees = create<EmployeesState>((set, get) => ({
  businessEmployees: { penguin_saldejums_uzvaras: ['janis_scooper'] },
  getBusinessEmployees: (businessId: string): string[] => {
    const currentBusinessEmployees = get().businessEmployees
    return currentBusinessEmployees[businessId]
  },
  getCompatibleEmployees: (
    businessId: string,
    businessType: string,
  ): EmployeeConfig[] => {
    const businessEmployees = get().businessEmployees[businessId]
    const compatibleEmployees = []
    for (const [id, object] of Object.entries(EMPLOYEES_CATALOG)) {
      if (
        object.preferredBusinessTypes.some(
          (preferredBusinessType) => preferredBusinessType === businessType,
        )
      ) {
        if (businessEmployees.includes(id)) {
          console.log(id, 'already in', businessEmployees)
        } else {
          compatibleEmployees.push(object)
        }
      }
    }
    console.log(compatibleEmployees)
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
    businessEmployeesCopy[businessId].push(employeeId)
    console.log(businessEmployeesCopy)

    set((state) => ({ businessEmployees: businessEmployeesCopy }))
    return true
  },
}))
