import {create} from "zustand"
import { db } from "#/db/initDb";
import { EMPLOYEES_CATALOG } from "#/db/employeesCatalog";

interface EmployeesState {
    getBusinessEmployees: (businessId: string) => Promise<string[]>;
    getCompatibleEmployees: (businessId: string, businessType: string) => Promise<string[]>
    hireEmployee: (businessId: string, employeeId: string) => Promise<boolean>;
}

export const useEmployees = create<EmployeesState>((set, get) => ({
    getBusinessEmployees: async (businessId: string): Promise<string[]> => {
        const businessEmployees = db.data.businessEmployees[businessId]
        console.log(businessEmployees)
        return businessEmployees
    },
    getCompatibleEmployees: async (businessId: string, businessType: string): Promise<string[]> => {
        console.log(businessId, businessType)

        console.log(EMPLOYEES_CATALOG)
        return []
    },
    hireEmployee: async (businessId: string, employeeId: string): Promise<boolean> => {
        console.log(businessId, employeeId)
        return true
    },

}))