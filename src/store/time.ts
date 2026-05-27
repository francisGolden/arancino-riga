import {create} from "zustand"
import type { ElapsedTimeResult } from "#/types"

interface TimeState {
    time: Record<string, number>,
    processSomething: (something: any) => Promise<boolean>,
    setTime: (timeObj: ElapsedTimeResult) => void,
}

export const useTime = create<TimeState>((set, get) => ({
    time: {},
    processSomething: async(something) => {
        console.log(something)
        return true
    },
    setTime: async (timeObj: ElapsedTimeResult) => {
        console.log(timeObj)
        const currentTime = get().time
        const currentTimeCopy = { ...currentTime}
        currentTimeCopy['elapsedTime'] = timeObj.elapsedTime
        currentTimeCopy['elapsedSeconds'] = timeObj.elapsedSeconds
        set(() => ({time: currentTimeCopy}))
    }
}))