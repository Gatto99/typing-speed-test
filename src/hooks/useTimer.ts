import {useEffect, useRef} from "react";
import {TestStatus, useTestState} from "../stores/test.ts";

export function useTimer() {
    const testStatus = useTestState((state) => state.testStatus);
    const timer = useTestState((state) => state.timer);
    const reduceTimer = useTestState((state) => state.reduceTimer);
    const timerId = useRef<number>(-1);

    useEffect(() => {
        switch (testStatus) {
            case TestStatus.IN_PROGRESS:
                timerId.current = setInterval(reduceTimer, 1000);
                return () => clearInterval(timerId.current);
            case TestStatus.FINISHED:
                clearInterval(timerId.current);
                break;
        }
    }, [reduceTimer, testStatus]);

    useEffect(() => {
        if (timer === 0) clearInterval(timerId.current);
    }, [timer]);
}
