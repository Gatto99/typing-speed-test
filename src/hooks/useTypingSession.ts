import {useCallback, useEffect, useRef, useState} from "react";
import {useUserStats} from "../stores/stats.ts";
import {TestStatus, useTestState} from "../stores/test.ts";
import {findIntervalIndex, type Interval} from "../utils/utils.ts";
import {CharStatus} from "../types.ts";

export function useTypingSession(textChars: string[]) {
    const testStatus = useTestState((state) => state.testStatus);
    const setTestStatus = useTestState((state) => state.setTestStatus);
    const setTotalCorrectChars = useUserStats((state) => state.setTotalCorrectChars);
    const setAccuracy = useUserStats((state) => state.setAccuracy);

    const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
    const [correctCharsIntervals, setCorrectCharsIntervals] = useState<Interval[]>([]);
    const totalCorrectChars = useRef<number>(0);

    useEffect(() => {
        if (textChars.length > 0 && currentCharIndex === textChars.length) {
            setTestStatus(TestStatus.FINISHED);
        }
    }, [currentCharIndex, setTestStatus, textChars.length]);

    const handleCorrectCharTyped = useCallback((index: number) => {
        totalCorrectChars.current += 1;
        setTotalCorrectChars(totalCorrectChars.current);
        setAccuracy((totalCorrectChars.current / (index + 1)) * 100);

        setCorrectCharsIntervals((prev) => {
            if (!prev.length) return [[index, index + 1]];
            const last = prev[prev.length - 1];
            if (index === last[1]) return [...prev.slice(0, -1), [last[0], last[1] + 1]];
            return [...prev, [index, index + 1]];
        });

        setCurrentCharIndex((i) => i + 1);
    }, [setAccuracy, setTotalCorrectChars])

    const handleIncorrectCharTyped = useCallback((index: number) => {
        setAccuracy((totalCorrectChars.current / (index + 1)) * 100);
        setCurrentCharIndex((i) => i + 1);
    }, [setAccuracy])

    const handleOnKeyDown = useCallback((event: KeyboardEvent) => {
        if (testStatus === TestStatus.FINISHED) return;

        const keyName = event.key;
        if (keyName === "Shift") return;

        if (testStatus === TestStatus.TO_START) {
            setTestStatus(TestStatus.IN_PROGRESS);
        }

        if (keyName === textChars[currentCharIndex]) {
            handleCorrectCharTyped(currentCharIndex);
        } else {
            handleIncorrectCharTyped(currentCharIndex);
        }
    }, [currentCharIndex, handleCorrectCharTyped, handleIncorrectCharTyped, setTestStatus, testStatus, textChars]);

    useEffect(() => {
        document.addEventListener("keydown", handleOnKeyDown);
        return () => document.removeEventListener("keydown", handleOnKeyDown);
    }, [handleOnKeyDown]);

    const getStatus = (index: number): CharStatus => {
        if (index > currentCharIndex) return CharStatus.PENDING;
        return findIntervalIndex(index, correctCharsIntervals) >= 0 ? CharStatus.CORRECT : CharStatus.INCORRECT;
    };

    return {currentCharIndex, getStatus};
}
