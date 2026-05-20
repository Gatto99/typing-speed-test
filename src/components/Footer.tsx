import {TestStatus, useTestState} from "../stores/test.ts";

export function Footer() {
    const setTestStatus = useTestState((state) => state.setTestStatus);
    const handleOnResetClick = () => {
        setTestStatus(TestStatus.TO_START)
    }

    return (
        <footer className={"w-full flex items-center justify-center"}>
            <button onClick={handleOnResetClick}>Reset test</button>
        </footer>
    )
}