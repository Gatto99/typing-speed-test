import {
    Difficulty,
    Mode,
    TestStatus,
    useTestState,
    useUserStats
} from "../stores/stats.ts";
import {useEffect, useRef, useState} from "react";
import {calculateWPM} from "../utils/utils.ts";

export function Stats() {
    const testStatus = useTestState((state) => state.testStatus);

    // Timer
    const timerId = useRef<number>(-1);
    const [timer, setTimer] = useState(60);
    const minutes = Math.floor(timer / 60);
    const seconds = Math.floor(timer % 60) < 10 ? '0' + Math.floor(timer % 60) : Math.floor(timer % 60);

    // Stats
    const totalCorrectChars = useUserStats((state) => state.totalCorrectChars);
    const wpm = useUserStats((state) => state.wpm);
    const setWpm = useUserStats((state) => state.setWpm)
    const updateBestWmp = useUserStats((state) => state.updateBestWmp);
    const accuracy = useUserStats((state) => state.accuracy);
    const resetStats = useUserStats((state) => state.resetStats);

    // Diffculty
    const difficulty: Difficulty = useTestState((state) => state.difficulty);
    const setDifficulty = useTestState((state) => state.setDifficulty);

    // Mode
    const mode: Mode = useTestState((state) => state.mode);
    const setMode = useTestState((state) => state.setMode);

    useEffect(() => {
        switch (testStatus) {
            case TestStatus.TO_START:
                setTimer(60);
                resetStats();
                break;
            case TestStatus.IN_PROGRESS:
                if(timer < 60) {
                    setWpm(calculateWPM(totalCorrectChars, 60 - timer));
                }
                timerId.current = setInterval(() => {
                    setTimer((state) => state - 1)
                }, 1000);
                return () => {
                    clearInterval(timerId.current)
                }
            case TestStatus.FINISHED:
                clearInterval(timerId.current);
                updateBestWmp();
                break;
            default:
                break;
        }
    }, [testStatus, totalCorrectChars, timer]);

    useEffect(() => {
        if(timer === 0)
            clearInterval(timerId.current)
    }, [timer]);

    return (
        <section className={"flex justify-between"}>
            <div id="stats" className={"text-sm"}>
                <div>WPM: <span className={""}>{wpm}</span></div>
                <div>Accuracy: <span className={""}>{accuracy}%</span></div>
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