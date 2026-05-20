import {useUserStats} from "../stores/stats.ts";
import {useTestState} from "../stores/test.ts";

export function StatsDisplay() {
    const timer = useTestState((state) => state.timer);
    const wpm = useUserStats((state) => state.wpm);
    const accuracy = useUserStats((state) => state.accuracy);

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60 < 10 ? `0${timer % 60}` : `${timer % 60}`;

    return (
        <div id="stats" className={"text-sm"}>
            <div>WPM: <span>{wpm}</span></div>
            <div>Accuracy: <span>{accuracy}%</span></div>
            <div>Time: <span>{minutes}:{seconds}</span></div>
        </div>
    );
}
