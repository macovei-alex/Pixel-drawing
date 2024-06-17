export class Logging {
    static debug(...message) {
        console.log(...message);
    }

    static error(...message) {
        console.error(...message);
    }

    static info(...message) {
        console.info(...message);
    }

    static warn(...message) {
        console.warn(...message);
    }
}