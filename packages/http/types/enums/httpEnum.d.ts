/**
 * @description: Request result set
 */
export declare enum ResultEnum {
    SUCCESS = 0,
    ERROR = 1,
    TIMEOUT = 401,
    TYPE = "success"
}
/**
 * @description: request method
 */
export declare enum RequestEnum {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
/**
 * @description:  contentTyp
 */
export declare enum ContentTypeEnum {
    JSON = "application/json;charset=UTF-8",
    FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
    FORM_DATA = "multipart/form-data;charset=UTF-8"
}
/**
 * 请求header
 * @description:  contentTyp
 */
export declare enum ConfigEnum {
    TOKEN = "X-Access-Token",
    TIMESTAMP = "X-TIMESTAMP",
    Sign = "X-Sign",
    TENANT_ID = "X-Tenant-Id",
    VERSION = "X-Version",
    X_LOW_APP_ID = "X-Low-App-ID"
}
