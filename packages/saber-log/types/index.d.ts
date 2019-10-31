export type IOptions = {
    logLevel?: number | undefined;
};
/**
 * @typedef {Object} IOptions
 * @property {number=} logLevel
 */
declare class Log {
    /** @type {IOptions} */
    options: IOptions;
    /**
     * @param {IOptions} options
     */
    setOptions(options: IOptions): void;
    get logLevel(): number;
    /**
     * Log anything using `console.log`
     * @param  {...any} args
     */
    log(...args: any[]): void;
    /**
     * Verbose logs
     * @param  {...any} args
     */
    verbose(...args: any[]): void;
    /**
     * Info logs
     * @param  {...any} args
     */
    info(...args: any[]): void;
    /**
     * Warning logs
     * @param  {...any} args
     */
    warn(...args: any[]): void;
    /**
     * Error logs
     * @param  {...any} args
     */
    error(...args: any[]): void;
    /**
     * Success logs
     * @param  {...any} args
     */
    success(...args: any[]): void;
}
export const colors: {
    options: any;
    reset: (s: any) => any;
    bold: (s: any) => any;
    dim: (s: any) => any;
    italic: (s: any) => any;
    underline: (s: any) => any;
    inverse: (s: any) => any;
    hidden: (s: any) => any;
    strikethrough: (s: any) => any;
    black: (s: any) => any;
    red: (s: any) => any;
    green: (s: any) => any;
    yellow: (s: any) => any;
    blue: (s: any) => any;
    magenta: (s: any) => any;
    cyan: (s: any) => any;
    white: (s: any) => any;
    gray: (s: any) => any;
    bgBlack: (s: any) => any;
    bgRed: (s: any) => any;
    bgGreen: (s: any) => any;
    bgYellow: (s: any) => any;
    bgBlue: (s: any) => any;
    bgMagenta: (s: any) => any;
    bgCyan: (s: any) => any;
    bgWhite: (s: any) => any;
    blackBright: (s: any) => any;
    redBright: (s: any) => any;
    greenBright: (s: any) => any;
    yellowBright: (s: any) => any;
    blueBright: (s: any) => any;
    magentaBright: (s: any) => any;
    cyanBright: (s: any) => any;
    whiteBright: (s: any) => any;
    bgBlackBright: (s: any) => any;
    bgRedBright: (s: any) => any;
    bgGreenBright: (s: any) => any;
    bgYellowBright: (s: any) => any;
    bgBlueBright: (s: any) => any;
    bgMagentaBright: (s: any) => any;
    bgCyanBright: (s: any) => any;
    bgWhiteBright: (s: any) => any;
};
export namespace chars {
    export const info: any;
    export const success: any;
    export const warning: any;
    export const error: any;
}
export declare const log: Log;
export {};
