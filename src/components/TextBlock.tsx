import {useEffect, useMemo} from "react";
import Char from "./Char.tsx";
import {useTypingSession} from "../hooks/useTypingSession.ts";
import {useTimer} from "../hooks/useTimer.ts";
import {useTestState} from "../stores/test.ts";

export function TextBlock() {
    const text = useTestState((state) => state.text);
    const setText = useTestState((state) => state.setText);

    useEffect(() => {
        // TODO: aggiungere chiamata/retrieve del testo in base alla modalità e difficoltà selezionata
        setText("The sun rose over the quiet town. Birds sang in the trees as people woke up and started their day. It was going to be a warm and sunny morning.");
    }, [setText]);

    const textChars = useMemo<string[]>(() => [...text], [text]);

    useTimer();
    const {currentCharIndex, getStatus} = useTypingSession(textChars);

    return (
        <section>
            {textChars.map((char, index) =>
                <Char key={index} status={getStatus(index)} isSelected={index === currentCharIndex}>{char}</Char>
            )}
        </section>
    );
}
