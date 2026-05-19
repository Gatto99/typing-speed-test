export const calculateWPM = (correctWords: number, pastSeconds: number): number => {
    if (pastSeconds === 0) return 0;
    return (correctWords / 5 * 60) / pastSeconds;
}
