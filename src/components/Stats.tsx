import {StatsDisplay} from "./StatsDisplay.tsx";
import {DifficultySelector} from "./DifficultySelector.tsx";
import {ModeSelector} from "./ModeSelector.tsx";

export function Stats() {
    return (
        <section className={"flex justify-between"}>
            <StatsDisplay />
            <DifficultySelector />
            <ModeSelector />
        </section>
    );
}
