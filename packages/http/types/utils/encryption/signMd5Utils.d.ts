export default class signMd5Utils {
    /**
     * json参数升序
     * @param jsonObj 发送参数
     */
    static sortAsc(jsonObj: any): {};
    /**
     * @param url 请求的url,应该包含请求参数(url的?后面的参数)
     * @param requestParams 请求参数(POST的JSON参数)
     * @returns {string} 获取签名
     */
    static getSign(url: any, requestParams: any): any;
    /**
     * @param url 请求的url
     * @returns {{}} 将url中请求参数组装成json对象(url的?后面的参数)
     */
    static parseQueryString(url: any): {};
    /**
     * @returns {*} 将两个对象合并成一个
     */
    static mergeObject(objectOne: any, objectTwo: any): any;
    static urlEncode(param: any, key: any, encode: any): string;
    /**
     * 接口签名用 生成header中的时间戳
     * @returns {number}
     */
    static getTimestamp(): number;
    static myIsNaN(value: any): boolean;
}
