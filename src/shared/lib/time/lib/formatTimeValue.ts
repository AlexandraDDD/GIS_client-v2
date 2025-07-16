/**
 * Преобразует 2 -> 02, 11 -> 11
 */
export function formatTimeValue(time: number) {
    return time.toString().padStart(2, '0');
}
