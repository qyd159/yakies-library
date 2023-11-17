export declare const URL_HASH_TAB = "__AGWE4H__HASH__TAG__PWHRG__";
export declare const noop: () => void;
/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export declare function setObjToUrlParams(baseUrl: string, obj: any): string;
export declare function deepMerge<T = any>(src?: any, target?: any): T;
/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export declare function cloneObject(obj: any): any;
/**
 * 获取url地址参数
 * @param paraName
 */
export declare function getUrlParam(paraName: any): string;
/**
 * 不用正则的方式替换所有值
 * @param text 被替换的字符串
 * @param checker  替换前的内容
 * @param replacer 替换后的内容
 * @returns {String} 替换后的字符串
 */
export declare function replaceAll(text: any, checker: any, replacer: any): any;
/**
 * 获取URL上参数
 * @param url
 */
export declare function getQueryVariable(url: any): {} | undefined;
/**
 * 判断是否显示办理按钮
 * @param bpmStatus
 * @returns {*}
 */
export declare function showDealBtn(bpmStatus: any): boolean;
/**
 * 数字转大写
 * @param value
 * @returns {*}
 */
export declare function numToUpper(value: any): string | null;
/**
 * 跳转至积木报表的 预览页面
 * @param url
 * @param id
 * @param token
 */
export declare function goJmReportViewPage(url: any, id: any, token: any): void;
/**
 *
 * byte to size
 * formatBytes(1024);       // 1 KB
 * formatBytes('1024');     // 1 KB
 * formatBytes(1234);       // 1.21 KB
 * formatBytes(1234, 3);    // 1.205 KB
 * @param {number} bytes file size
 */
export declare function formatSizeUnits(bytes: any, decimals?: number): string;
