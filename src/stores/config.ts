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

export type TestConfigState = {
    difficulty: Difficulty,
    mode: Mode,
    setDifficulty: (newDifficulty: Difficulty) => void,
    setMode: (newMode: Mode) => void,
}

export const useTestConfig = create<TestConfigState>((set) => ({
    difficulty: Difficulty.Easy,
    setDifficulty: (newDifficulty) => set({difficulty: newDifficulty}),
    mode: Mode.Timed,
    setMode: (newMode) => set({mode: newMode}),
}))
