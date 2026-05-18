import {create} from "zustand/react";

export enum Difficulty {
    Easy,
    Medium,
    Hard
}

export enum Mode {
    Timed = "Timed (60 seconds)",
    Passage = "Passage"
}

export type UserStatsState = {
    startTime: Date | null,
    finishTime: Date | null,
    wpm: number,
    bestWpm: number,
    accuracy: number,
    setWpm: (newWpm: number) => void,
    setBestWpm: (newBest: number) => void,
    setAccuracy: (newAccuracy: number) => void,
    setStartTime: () => void,
    setFinishTime: () => void,
    resetStats: () => void
}

export type UserDifficultyState = {
    difficulty: Difficulty,
    setDifficulty: (newDifficulty: Difficulty) => void,
    resetDifficulty: () => void
}

export type UserModeState = {
    mode: Mode,
    setMode: (newMode: Mode) => void,
    resetMode: () => void
}

export const useUserStats = create<UserStatsState>((set) => ({
    startTime: null,
    finishTime: null,
    wpm: 0,
    bestWpm: 0,
    accuracy: 0,
    setWpm: (newWpm: number) => set({wpm: newWpm}),
    setBestWpm: (newBest: number) => set({bestWpm: newBest}),
    setAccuracy: (newAccuracy: number) => set({accuracy: newAccuracy}),
    setStartTime: () => set({startTime: new Date()}),
    setFinishTime: () => set({finishTime: new Date()}),
    resetStats: () => set({wpm: 0, accuracy: 0, bestWpm: 0, startTime: null, finishTime: null})
}))

export const useUserDifficulty = create<UserDifficultyState>((set) => ({
    difficulty: Difficulty.Easy,
    setDifficulty: (newDifficulty: Difficulty) => set({difficulty: newDifficulty}),
    resetDifficulty: () => set({difficulty: Difficulty.Easy})
}))

export const useUserMode = create<UserModeState>((set) => ({
    mode: Mode.Timed,
    setMode: (newMode: Mode) => set({mode: newMode}),
    resetMode: () => set({mode: Mode.Timed})
}))