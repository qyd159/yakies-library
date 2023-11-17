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

let ls:any = typeof localStorage === 'undefined' ? (async () => {
  ls= (await import('localStorage')).default;
  // 使用导入的模块
})()
 : localStorage;

/**
 * token保存到本地
 * @param token
 */
export function setTokenToLocal(token: string) {
  ls.setItem(TOKEN_STORAGE_KEY, token);
}
export function setRefreshTokenToLocal(refreshToken: string) {
  ls.setItem(TOKEN_REFRESH_STORAGE_KEY, refreshToken);
}
/**
 * 从本地获取token
 */
export function getTokenFromLocal() {
  return ls.getItem(TOKEN_STORAGE_KEY);
}
export function getRefreshTokenFromLocal() {
  return ls.getItem(TOKEN_REFRESH_STORAGE_KEY);
}
/**
 * 清除本地token
 */
export function clearToken() {
  ls.removeItem(TOKEN_STORAGE_KEY);
  ls.removeItem(USERNAME_STORAGE_KEY);
  ls.removeItem(TOKEN_REFRESH_STORAGE_KEY);
}

/**
 * 用户名保存到本地
 */
export function setUsernameToLocal(username: string) {
  ls.setItem(USERNAME_STORAGE_KEY, username);
}
/**
 * 从本地获取用户名
 */
export function getUsernameFromLocal() {
  return ls.getItem(USERNAME_STORAGE_KEY);
}
