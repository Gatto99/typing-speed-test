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
    wpm: number,
    bestWpm: number,
    accuracy: number,
    totalCorrectChars: number,
    updateBestWmp: () => void,
    setWpm: (wpm: number) => void,
    setTotalCorrectChars: (newTotalCorrectChars: number) => void,
    setAccuracy: (newAccuracy: number) => void,
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

export enum TestStatus {
    TO_START,
    IN_PROGRESS,
    FINISHED
}

export type TestState = {
    testStatus: TestStatus,
    text: string,
    timer: number,
    setTestStatus: (newStatus: TestStatus) => void,
    setText: (newText: string) => void,
    reduceTimer: () => void,
    resetTimer: () => void
}

export const useTestState = create<TestState & UserDifficultyState & UserModeState>((set) => ({
    // Stato test
    testStatus: TestStatus.TO_START,
    setTestStatus: (newStatus: TestStatus) => set({testStatus: newStatus}),
    // Testo
    text: "",
    setText: (newText: string) => set({text: newText}),
    // Timer
    timer: 60,
    reduceTimer: () => set((state) => {
        return {timer: state.timer - 1}
    }),
    resetTimer: () => set({timer: 60}),
    // Difficoltà
    difficulty: Difficulty.Easy,
    setDifficulty: (newDifficulty: Difficulty) => set({difficulty: newDifficulty}),
    resetDifficulty: () => set({difficulty: Difficulty.Easy}),
    // Modalità
    mode: Mode.Timed,
    setMode: (newMode: Mode) => set({mode: newMode}),
    resetMode: () => set({mode: Mode.Timed})
}))

export const useUserStats = create<UserStatsState>((set) => ({
    wpm: 0,
    bestWpm: Number(localStorage.getItem("bestWpm")) || 0,
    accuracy: 0,
    totalCorrectChars: 0,
    updateBestWmp: () => set((state) => {
        const bestWpm = Number(localStorage.getItem("bestWpm"));
        if(!bestWpm || Number(bestWpm) < state.wpm) {
            localStorage.setItem("bestWpm", state.wpm.toString());
            return {bestWpm: state.wpm}
        }
        return {bestWpm: bestWpm}
    }),
    setWpm: (wpm: number) => set({wpm: Math.floor(wpm)}),
    setTotalCorrectChars: (newTotalCorrectChars: number) => set({totalCorrectChars: newTotalCorrectChars}),
    setAccuracy: (newAccuracy: number) => set({accuracy: Math.floor(newAccuracy)}),
    resetStats: () => set({wpm: 0, accuracy: 0})
}))