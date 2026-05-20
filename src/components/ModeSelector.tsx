import {Mode, useTestConfig} from "../stores/config.ts";

export function ModeSelector() {
    const mode = useTestConfig((state) => state.mode);
    const setMode = useTestConfig((state) => state.setMode);

    return (
        <div id="mode" className={"text-xs flex space-x-2"}>
            <span>Mode</span>
            <div className={"space-x-1"}>
                {(Object.keys(Mode).filter(k => isNaN(Number(k))) as (keyof typeof Mode)[]).map((key) => {
                    const value = Mode[key];
                    const isActive = value === mode;
                    return (
                        <button key={key} className={isActive ? 'selected' : ''} onClick={() => !isActive && setMode(value)}>
                            {value}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
