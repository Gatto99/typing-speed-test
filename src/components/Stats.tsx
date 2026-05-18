import {Difficulty, Mode, useUserDifficulty, useUserMode, useUserStats} from "../stores/stats.ts";
import {useEffect, useRef, useState} from "react";

export function Stats() {
    // Timer
    const timerId = useRef<number>(0);
    const [timer, setTimer] = useState(60);
    const minutes = Math.floor(timer / 60);
    const seconds = Math.floor(timer % 60) === 0 ? '00' : Math.floor(timer % 60);

    // Stats
    const wpm = useUserStats((state) => state.wpm);
    const accuracy = useUserStats((state) => state.accuracy);

    // Diffculty
    const difficulty: Difficulty = useUserDifficulty((state) => state.difficulty);
    const setDifficulty = useUserDifficulty((state) => state.setDifficulty);

    // Mode
    const mode: Mode = useUserMode((state) => state.mode);
    const setMode = useUserMode((state) => state.setMode);

    useEffect(() => {
        timerId.current = setInterval(() => {
            setTimer((state) => state - 1)
        }, 1000);

        return () => {
            clearInterval(timerId.current)
        }
    }, []);

    return (
        <section className={"flex justify-between"}>
            <div id="stats" className={"text-sm"}>
                <div>WPM: <span className={""}>{wpm}</span></div>
                <div>Accuracy: <span className={""}>{accuracy}</span></div>
                <div>Time: <span className={""}>{minutes}:{seconds}</span></div>
            </div>
            <div id="diffulty" className={"text-xs flex space-x-2"}>
                <span>Difficulty:</span>
                <div className={"space-x-1"}>
                    {(Object.keys(Difficulty).filter(k => isNaN(Number(k))) as (keyof typeof Difficulty)[]).map((key) => {
                        const value = Difficulty[key];
                        const isActive = value === difficulty;
                        return (
                            <button key={key} className={isActive ? 'selected' : ''} onClick={() => !isActive && setDifficulty(value)}>
                                {key}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div id="mode" className={"text-xs flex space-x-2"}>
                <span>Mode</span>
                <div className={"space-x-1"}>
                    {(Object.keys(Mode).filter((k) => isNaN(Number(k))) as (keyof typeof Mode)[]).map((key) => {
                        const value = Mode[key];
                        const isActive = value === mode;
                        return (
                            <button key={key} className={isActive ? 'selected' : ''} onClick={() => !isActive && setMode(value)}>{value}</button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}