import Cookie from 'js-cookie';
import {
  TOKEN_KEY,
  CACHE_TYPE,
} from './const';
import { _query, getEnv as getEnvUtil, getDomain } from './utils';

export default class TokenManager {
  constructor(LOCAL_DOMAIN = '', private cacheType = CACHE_TYPE.COOKIE, private tokenKey = TOKEN_KEY, private DOMAINS: Record<string,string> = {}) {
    this.cacheType = cacheType;
    this.tokenKey = `__${tokenKey}__${this.getEnv()}__`;
    this.DOMAINS = {
      DEV: 'www.yakies.cn',
      PRO: 'www.yakies.cn',
      ...(LOCAL_DOMAIN ? { LOCAL: LOCAL_DOMAIN } : {}),
    };
  }

  /**
   * 返回统一管理Token
   * @returns {string} token
   */
  getToken() {
    switch (this.cacheType) {
      case CACHE_TYPE.SESSION:
        return sessionStorage.getItem(this.tokenKey);
      case CACHE_TYPE.LOCAL:
        return localStorage.getItem(this.tokenKey);
      default:
        return Cookie.get(this.tokenKey);
    }
  }

  /**
   * 设置统一管理Token
   * @param {string} token
   * @returns {string | null}
   */
  setToken(token: string) {
    const params = _query(window.location.search);
    if (params.redirect && (String(params.redirect).includes('localhost:') || String(params.redirect).includes('127.0.0'))) {
      window.location.href = `${params.redirect}?code=${token}`;
      return;
    }
    switch (this.cacheType) {
      case CACHE_TYPE.SESSION:
        return sessionStorage.getItem(this.tokenKey);
      case CACHE_TYPE.LOCAL:
        return localStorage.setItem(this.tokenKey, token);
      default:
        if (this.getEnv() === 'LOCAL') {
          return Cookie.set(this.tokenKey, token);
        }
        if (this.getEnv() === 'PRO') {
          return Cookie.set(this.tokenKey, token, {
            domain: getDomain(),
          });
        }
        return Cookie.set(this.tokenKey, token, {
          domain: `.${this.getEnv().toLowerCase()}${getDomain()}`,
        });
    }
  }

  /**
   * 移除统一管理Token
   */
  removeToken() {
    switch (this.cacheType) {
      case CACHE_TYPE.SESSION:
        return sessionStorage.removeItem(this.tokenKey);
      case CACHE_TYPE.LOCAL:
        return localStorage.removeItem(this.tokenKey);
      default:
        if (this.getEnv() === 'LOCAL') {
          return Cookie.remove(this.tokenKey);
        }
        if (this.getEnv() === 'PRO') {
          return Cookie.remove(this.tokenKey, {
            domain: getDomain(),
          });
        }
        return Cookie.remove(this.tokenKey, {
          domain: `.${this.getEnv().toLowerCase()}${getDomain()}`,
        });
    }
  }

  /**
   * 环境判断
   */
  getEnv() {
    return getEnvUtil();
  }

  /**
   * 退出登录
   */
  goLogin(redirectUrl:string) {
    this.removeToken();
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }

    window.location.href = `${window.location.protocol}//${this.DOMAINS[this.getEnv()]}/login?redirect=${window.location.href}`;
  }

  setTokenByCode() {
    const params = _query(window.location.search);
    const { code } = params;
    if (code && !this.getToken()) {
      this.setToken(code);
    }
  }
}

if (getEnvUtil() === 'LOCAL') {
  const params = _query(window.location.search);
  const { code } = params;
  const tm = new TokenManager();
  if (code && !tm.getToken()) {
    tm.setToken(code);
  }
}
