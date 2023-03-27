/*
 * @Author: qinyadong
 * @Date: 2022-06-20 20:03:21
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-06-20 20:04:48
 * @FilePath: \universal-vite-vue3\packages\api\src\fetch\token.ts
 */
export const TOKEN_STORAGE_KEY = 'token';
export const TOKEN_REFRESH_STORAGE_KEY = 'refresh-token';
export const USERNAME_STORAGE_KEY = 'username';

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
export function setTokenToLocal(token: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}
export function setRefreshTokenToLocal(refreshToken: string) {
    localStorage.setItem(TOKEN_REFRESH_STORAGE_KEY, refreshToken);
}
/**
 * 从本地获取token
 */
export function getTokenFromLocal() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}
export function getRefreshTokenFromLocal() {
    return localStorage.getItem(TOKEN_REFRESH_STORAGE_KEY);
}
/**
 * 清除本地token
 */
export function clearToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USERNAME_STORAGE_KEY);
    localStorage.removeItem(TOKEN_REFRESH_STORAGE_KEY);
}

/**
 * 用户名保存到本地
 */
export function setUsernameToLocal(username: string) {
    localStorage.setItem(USERNAME_STORAGE_KEY, username);
}
/**
 * 从本地获取用户名
 */
export function getUsernameFromLocal() {
    return localStorage.getItem(USERNAME_STORAGE_KEY);
}
