import {Difficulty, useTestConfig} from "../stores/config.ts";

export function DifficultySelector() {
    const difficulty = useTestConfig((state) => state.difficulty);
    const setDifficulty = useTestConfig((state) => state.setDifficulty);

    return (
        <div id="difficulty" className={"text-xs flex space-x-2"}>
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
    );
}
