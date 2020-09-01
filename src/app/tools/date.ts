export function createTimestamp(): number {
    const now = new Date();
    const ms = now.getTime() + now.getTimezoneOffset() * 60 * 1000;

    return Math.floor(ms / 1000);
}
