declare global {
    interface String {
        trimStart(): string;
        trimEnd(): string;
    }
}
export declare type Fixed = 0 | 1 | 2 | 3;
export interface ILyric {
    time?: number;
    text: string;
}
export declare type State = Readonly<{
    info: Map<string, string>;
    lyric: readonly ILyric[];
}>;
export declare type TrimOptios = Partial<{
    trimStart: boolean;
    trimEnd: boolean;
}>;
export declare const parser: (lrcString: string, option?: TrimOptios) => State;
export declare const convertTimeToTag: (time: number | undefined, fixed: Fixed, withBrackets?: boolean) => string;
export declare const formatText: (text: string, spaceStart: number, spaceEnd: number) => string;
export interface IFormatOptions {
    spaceStart: number;
    spaceEnd: number;
    fixed: Fixed;
    endOfLine?: "\n" | "\r\n" | "\r";
}
export declare const stringify: (state: State, option: IFormatOptions) => string;
