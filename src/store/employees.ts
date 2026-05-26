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
  ) => Promise<boolean>;
  addBusinessToEmployees: (businessId: string) => Promise<boolean>;
  hydrateEmployees: (savedEmployees: Record<string, string[]>) => void;
}

const updateDbEmployees = async (newBusinessEmployees: Record<string, string[]>): Promise<void> => {
    try {
        await db.update((data) => data.businessEmployees = newBusinessEmployees)
    } catch (error) {
        console.error('could not update business employees', error)
    }
}

export const useEmployees = create<EmployeesState>((set, get) => ({
  businessEmployees: {
    // penguin_saldejums_uzvaras: ['janis_scooper']
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
    businessEmployeesCopy[businessId] = [...businessEmployeesCopy[businessId], employeeId]
    console.log(businessEmployeesCopy)

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
  addBusinessToEmployees: async (businessId: string) => {
    const currentEmployees = get().businessEmployees
    console.log(currentEmployees, businessId)

    const currentEmployeesCopy = { ...currentEmployees }
    currentEmployeesCopy[businessId] = []
    set(() => ({businessEmployees: currentEmployeesCopy }))

    try {
        await updateDbEmployees(currentEmployeesCopy)
        return true
    } catch (error) {
        set(() => ({ businessEmployees: currentEmployees }))
        console.error('could not add business to employees', error)
        return false
    }
  },
  hydrateEmployees: (savedEmployees: Record<string, string[]>) => {
    set(() => ({ businessEmployees: savedEmployees }))
  }
}))
