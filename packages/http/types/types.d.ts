declare type Recordable<T = any> = Record<string, T>;
export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;
export type SuccessMessageMode = 'none' | 'success' | 'error' | undefined;
export type RequestOptions = {
    joinParamsToUrl?: boolean;
    formatDate?: boolean;
    isTransformResponse?: boolean;
    isReturnNativeResponse?: boolean;
    joinPrefix?: boolean;
    apiUrl?: string;
    urlPrefix?: string;
    joinTime?: boolean;
    ignoreCancelToken?: boolean;
    withToken?: boolean;
    dataKey?: string;
    loading?: boolean;
};
export interface Result<T = any> {
    code: number;
    type: 'success' | 'error' | 'warning';
    message: string;
    result?: T;
    data?: T;
    success: boolean;
}
export interface UploadFileParams {
    data?: Recordable;
    name?: string;
    file: File | Blob;
    filename?: string;
    [key: string]: any;
}
export interface UploadFileCallBack {
    success?: any;
    isReturnResponse?: boolean;
}
export {};
