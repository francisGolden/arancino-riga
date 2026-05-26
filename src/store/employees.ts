import { create } from 'zustand'
import { db } from '#/db/initDb'
import { EMPLOYEES_CATALOG } from '#/db/employeesCatalog'
import type { EmployeeConfig } from '#/types'

interface EmployeesState {
  businessEmployees: Record<string, string[]>
  getBusinessEmployees: (businessId: string) => string[]
  getCompatibleEmployees: (
    businessId: string,
    businessType: string,
  ) => EmployeeConfig[]
  hireEmployee: (businessId: string, employeeId: string) => Promise<boolean>
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
  ): Promise<boolean> => {
    console.log(businessId, employeeId)
    return true
  },
}))
