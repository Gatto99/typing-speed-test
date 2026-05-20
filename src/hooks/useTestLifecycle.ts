import {useEffect} from "react";
import {useUserStats} from "../stores/stats.ts";
import {TestStatus, useTestState} from "../stores/test.ts";
import {calculateWPM} from "../utils/utils.ts";

export function useTestLifecycle() {
    const testStatus = useTestState((state) => state.testStatus);
    const timer = useTestState((state) => state.timer);
    const totalCorrectChars = useUserStats((state) => state.totalCorrectChars);
    const setWpm = useUserStats((state) => state.setWpm);
    const updateBestWmp = useUserStats((state) => state.updateBestWmp);
    const resetStats = useUserStats((state) => state.resetStats);
    const resetTest = useTestState((state) => state.resetTest);

    useEffect(() => {
        switch (testStatus) {
            case TestStatus.TO_START:
                resetStats()
                resetTest()
                break;
            case TestStatus.IN_PROGRESS:
                if (timer < 60) {
                    setWpm(calculateWPM(totalCorrectChars, 60 - timer));
                }
                break;
            case TestStatus.FINISHED:
                updateBestWmp();
                break;
        }
    }, [testStatus, totalCorrectChars, timer, resetTest, updateBestWmp, setWpm, resetStats]);
}
