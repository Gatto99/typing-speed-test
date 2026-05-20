import {create} from "zustand/react";

export type UserStatsState = {
    wpm: number,
    bestWpm: number,
    accuracy: number,
    totalCorrectChars: number,
    updateBestWmp: () => void,
    setWpm: (wpm: number) => void,
    setTotalCorrectChars: (newTotalCorrectChars: number) => void,
    setAccuracy: (newAccuracy: number) => void,
    resetStats: () => void,
}

export const useUserStats = create<UserStatsState>((set) => ({
    wpm: 0,
    bestWpm: Number(localStorage.getItem("bestWpm")) || 0,
    accuracy: 0,
    totalCorrectChars: 0,
    updateBestWmp: () => set((state) => {
        const bestWpm = Number(localStorage.getItem("bestWpm"));
        if (!bestWpm || bestWpm < state.wpm) {
            localStorage.setItem("bestWpm", state.wpm.toString());
            return {bestWpm: state.wpm};
        }
        return {bestWpm};
    }),
    setWpm: (wpm) => set({wpm: Math.floor(wpm)}),
    setTotalCorrectChars: (newTotalCorrectChars) => set({totalCorrectChars: newTotalCorrectChars}),
    setAccuracy: (newAccuracy) => set({accuracy: Math.floor(newAccuracy)}),
    resetStats: () => set({wpm: 0, accuracy: 0}),
}))
