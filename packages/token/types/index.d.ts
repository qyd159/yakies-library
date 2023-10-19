export default class TokenManager {
    private cacheType;
    private tokenKey;
    private DOMAINS;
    constructor(LOCAL_DOMAIN?: string, cacheType?: string, tokenKey?: string, DOMAINS?: Record<string, string>);
    /**
     * 返回统一管理Token
     * @returns {string} token
     */
    getToken(): string | null | undefined;
    /**
     * 设置统一管理Token
     * @param {string} token
     * @returns {string | null}
     */
    setToken(token: string): string | void | null;
    /**
     * 移除统一管理Token
     */
    removeToken(): void;
    /**
     * 环境判断
     */
    getEnv(): string;
    /**
     * 退出登录
     */
    goLogin(redirectUrl: string): void;
    setTokenByCode(): void;
}
