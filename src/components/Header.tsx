import {useUserStats} from "../stores/stats.ts";

export function Header() {
    const bestWpm = useUserStats((state) => state.bestWpm);

    return (
        <header className={"flex w-full justify-between"}>
            <div>
                <img id="logo" src="../assets/logo-large.svg" alt="logo" />
            </div>
            <div className={"flex space-x-1"}>
                <img src="../assets/icon-personal-best.svg" alt="personal-best" />
                <span>Personal best: </span>
                <span>{bestWpm} WPM</span>
            </div>
        </header>
    )
}