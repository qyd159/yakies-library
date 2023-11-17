export declare function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object;
declare type Recordable<T = any> = Record<string, T>;
/**
 * @description: Format request parameter time
 */
export declare function formatRequestDate(params: Recordable): void;
export {};
