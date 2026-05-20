import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Char, {CharStatus} from "./Char.tsx";
import {TestStatus, useTestState, useUserStats} from "../stores/stats.ts";

export function TextBlock() {
    const testStatus = useTestState((state) => state.testStatus);
    const setTestStatus = useTestState((state) => state.setTestStatus);

    const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);

    // Contiene gli intervalli di caratteri scritti correttamente.
    // E.g. [[0,4],[6,8]] vuol dire che:
    //  - Il carattere a indice 0 fino al 3 sono stati scritto correttamente.
    //  - 4 e 5 sono scritti in maniera sbagliata
    //  - Dal 6 al 7 sono scritti bene
    //  - Dal 8 in poi sono scritti male (fino al'indice corrente, dopo il quale non sono ancora stati scritti)
    const [correctCharsIntervals, setCorrectCharsIntervals] = useState<number[][]>([]);
    const totalCorrectChars = useRef<number>(0);
    const setTotalCorrectChars = useUserStats((state) => state.setTotalCorrectChars);
    const setAccuracy = useUserStats((state) => state.setAccuracy);

    const timer = useTestState((state) => state.timer);
    const reduceTimer = useTestState((state) => state.reduceTimer);
    const resetTimer = useTestState((state) => state.resetTimer);
    const timerId = useRef<number>(-1);

    const text = useTestState((state) => state.text);
    const setText = useTestState((state) => state.setText);
    const textChars = useMemo<string[]>(() => {
        let chars: string[] = [];
        for(const char of text) {
            chars.push(char);
        }

        return chars;
    }, [text]);

    function handleCorrectCharTyped() {
        totalCorrectChars.current += 1;
        setTotalCorrectChars(totalCorrectChars.current);
        setAccuracy((totalCorrectChars.current / (currentCharIndex + 1)) * 100);

        // Caso iniziale
        if (!correctCharsIntervals.length) {
            correctCharsIntervals.push([currentCharIndex, currentCharIndex+1])
        } else {
            const lastInterval = correctCharsIntervals.pop() as number[]

            // Caso: cursore su lettera successiva ad una lettera scritta correttamente
            if (currentCharIndex === lastInterval[1]) {
                const upperBound: number = lastInterval[1] + 1;
                correctCharsIntervals.push([lastInterval[0], upperBound])
            } else {
                // Caso: cursore dopo caratteri scritti male -> Aggiungere nuovo intervallo
                correctCharsIntervals.push(lastInterval)
                correctCharsIntervals.push([currentCharIndex, currentCharIndex + 1])
            }
        }
        setCorrectCharsIntervals(correctCharsIntervals)
        // Aggiorna di 1 l'indice corrente
        setCurrentCharIndex((state) => state + 1);
    }

    function handleIncorrectCharTyped() {
        setAccuracy((totalCorrectChars.current / (currentCharIndex + 1)) * 100);
        // Aggiorna di 1 l'indice corrente
        setCurrentCharIndex((state) => state + 1);
    }

    const handleTestCompleted = () => {
        setTestStatus(TestStatus.FINISHED);
    }

    const handleOnKeyDown = useCallback((event: KeyboardEvent) => {
        if(testStatus === TestStatus.FINISHED) return;

        if(testStatus === TestStatus.TO_START) {
            setTestStatus(TestStatus.IN_PROGRESS);
        }

        const keyName = event.key;

        if(keyName === "Shift") return;

        if(keyName === textChars[currentCharIndex]) {
            handleCorrectCharTyped();
        } else {
            handleIncorrectCharTyped()
        }
    }, [currentCharIndex, textChars])

    useEffect(() => {
        // TODO: aggiungere chiamata/retrieve del testo in base alla modalità e difficoltà selezionata
        setText("The sun rose over the quiet town. Birds sang in the trees as people woke up and started their day. It was going to be a warm and sunny morning.")

        // Aggiungi event listener a click su tastiera
        document.addEventListener("keydown", handleOnKeyDown)

        return () => {
            document.removeEventListener("keydown", handleOnKeyDown)
        }
    }, [handleOnKeyDown])

    // TODO: quando lo stato diventa TO_START mi devo assicurare che gli state siano resettati
    useEffect(() => {
        if(testStatus === TestStatus.TO_START) {
            setCurrentCharIndex(0);
            setCorrectCharsIntervals([]);
            totalCorrectChars.current = 0;
        }
    }, [testStatus]);

    useEffect(() => {
        switch (testStatus) {
            case TestStatus.TO_START:
                resetTimer();
                break;
            case TestStatus.IN_PROGRESS:
                timerId.current = setInterval(() => {
                    reduceTimer()
                }, 1000);
                return () => {
                    clearInterval(timerId.current)
                }
            case TestStatus.FINISHED:
                clearInterval(timerId.current);
                break;
            default:
                break;
        }
    }, [testStatus, totalCorrectChars, timer]);

    useEffect(() => {
        if(timer === 0)
            clearInterval(timerId.current);
    }, [timer]);

    useEffect(() => {
        if(currentCharIndex === textChars.length) {
            handleTestCompleted();
        }
    }, [currentCharIndex]);

    const isLowerInterval = (num: number, interval: number[]): boolean => {
        return num < interval[0]
    }

    const isOverInterval = (num: number, interval: number[]): boolean => {
        return num >= interval[1]
    }

    const isInsideInterval = (num: number, interval: number[]): boolean => {
        return num >= interval[0] && num < interval[1]
    }

    const getIndexInterval = (index: number) => {
        let low = 0
        let high = correctCharsIntervals.length - 1;

        // TODO: modifica per usare else if?
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            if(isInsideInterval(index, correctCharsIntervals[mid])) {
                return mid
            }

            if(isLowerInterval(index, correctCharsIntervals[mid])) {
                high = mid - 1
            }

            if(isOverInterval(index, correctCharsIntervals[mid])) {
                low = mid + 1
            }
        }
        return -1
    }

    const getCharStatus = (index: number): CharStatus => {
        if(index > currentCharIndex) {
            return CharStatus.PENDING
        }

        return getIndexInterval(index) < 0 ? CharStatus.INCORRECT : CharStatus.CORRECT
    }

    return (
        <section>
            {textChars.map((char, index) =>
                <Char key={index} status={getCharStatus(index)} isSelected={index === currentCharIndex}>{char}</Char>
            )}
        </section>
    )
}