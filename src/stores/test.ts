import {create} from "zustand/react";

export enum TestStatus {
    TO_START,
    IN_PROGRESS,
    FINISHED
}

export type TestState = {
    sessionId: number,
    testStatus: TestStatus,
    text: string,
    timer: number,
    setTestStatus: (newStatus: TestStatus) => void,
    setText: (newText: string) => void,
    reduceTimer: () => void,
    resetTest: () => void,
}

export const useTestState = create<TestState>((set) => ({
    sessionId: 0,
    testStatus: TestStatus.TO_START,
    text: "",
    timer: 60,
    setText: (newText) => set({text: newText}),
    setTestStatus: (newStatus) => set({testStatus: newStatus}),
    reduceTimer: () => set((state) => ({timer: state.timer - 1})),
    resetTest: () => set((state) => ({
        testStatus: TestStatus.TO_START,
        timer: 60,
        sessionId: state.sessionId + 1,
    })),
}))