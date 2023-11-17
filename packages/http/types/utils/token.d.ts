export declare const TOKEN_STORAGE_KEY = "token";
export declare const TOKEN_REFRESH_STORAGE_KEY = "refresh-token";
export declare const USERNAME_STORAGE_KEY = "username";
export interface ServicesRes<T> {
    code: number;
    data: T;
    msg: string;
}
export interface SearchListRes<T> {
    datas: T;
    meta: any;
}
/**
 * token保存到本地
 * @param token
 */
export declare function setTokenToLocal(token: string): void;
export declare function setRefreshTokenToLocal(refreshToken: string): void;
/**
 * 从本地获取token
 */
export declare function getTokenFromLocal(): any;
export declare function getRefreshTokenFromLocal(): any;
/**
 * 清除本地token
 */
export declare function clearToken(): void;
/**
 * 用户名保存到本地
 */
export declare function setUsernameToLocal(username: string): void;
/**
 * 从本地获取用户名
 */
export declare function getUsernameFromLocal(): any;
