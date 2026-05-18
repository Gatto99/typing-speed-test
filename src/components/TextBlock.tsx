import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Char, {CharStatus} from "./Char.tsx";
import {useUserStats} from "../stores/stats.ts";

export function TextBlock({textBlock}: {textBlock: string}) {
    const startTime = useUserStats((state) => state.startTime);
    const setStartTime = useUserStats((state) => state.setStartTime);

    const setFinishTime = useUserStats((state) => state.setFinishTime);

    const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);

    // Contiene gli intervalli di caratteri scritti correttamente.
    // E.g. [[0,4],[6,8]] vuol dire che:
    //  - Il carattere a indice 0 fino al 3 sono stati scritto correttamente.
    //  - 4 e 5 sono scritti in maniera sbagliata
    //  - Dal 6 al 7 sono scritti bene
    //  - Dal 8 in poi sono scritti male (fino al'indice corrente, dopo il quale non sono ancora stati scritti)
    const [correctCharsIntervals, setCorrectCharsIntervals] = useState<number[][]>([]);
    // TODO: qui mettere direttamente l'accuracy
    const totalCorrectChars = useRef<number>(0);

    const textChars = useMemo<string[]>(() => {
        let chars: string[] = [];
        for(const char of textBlock) {
            chars.push(char);
        }

        return chars;
    }, [textBlock]);

    function handleCorrectCharTyped() {
        totalCorrectChars.current += 1;

        // Caso iniziale
        if (!correctCharsIntervals.length) {
            correctCharsIntervals.push([0, 1])
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
        // Aggiorna di 1 l'indice corrente
        setCurrentCharIndex((state) => state + 1);
    }

    const handleOnKeyDown = useCallback((event: KeyboardEvent) => {
        const keyName = event.key;

        if(!startTime) {
            setStartTime();
        }

        if(currentCharIndex === textChars.length) {
            setFinishTime();
        }

        if(keyName === textChars[currentCharIndex]) {
            handleCorrectCharTyped();
        } else {
            handleIncorrectCharTyped()
        }
    }, [currentCharIndex, textChars])

    useEffect(() => {
        // Aggiungi event listener a click su tastiera
        document.addEventListener("keydown", handleOnKeyDown)

        return () => {
            document.removeEventListener("keydown", handleOnKeyDown)
        }
    }, [handleOnKeyDown])

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