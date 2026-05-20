export type Interval = [number, number];

export const calculateWPM = (correctChars: number, pastSeconds: number): number => {
    if (pastSeconds === 0) return 0;
    return (correctChars / 5 * 60) / pastSeconds;
}

export function findIntervalIndex(index: number, intervals: Interval[]): number {
    let low = 0;
    let high = intervals.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const [start, end] = intervals[mid];
        if (index >= start && index < end) return mid;
        if (index < start) high = mid - 1;
        else low = mid + 1;
    }
    return -1;
}
