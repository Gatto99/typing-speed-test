export function Header() {
    return (
        <header className={"flex w-full justify-between"}>
            <div>
                <img id="logo" src="../assets/logo-large.svg" alt="logo" />
            </div>
            <div className={"flex space-x-1"}>
                <img src="../assets/icon-personal-best.svg" alt="personal-best" />
                <span>Personal best: </span>
                <span>92 WPM</span>
            </div>
        </header>
    )
}