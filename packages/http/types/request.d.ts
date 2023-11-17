import type { AxiosRequestConfig } from 'axios';
import { RequestOptions as AxiosRequestOptions } from './types';
interface RequestOptions {
    /**
     * 使用的服务器。
     *
     * - `prod`: 生产服务器
     * - `dev`: 测试服务器
     * - `mock`: 模拟服务器
     *
     * @default prod
     */
    server?: 'prod' | 'dev' | 'mock';
    fileUpload?: boolean;
    axiosOptions?: AxiosRequestConfig;
    errorCaptured?: (err: any) => void;
}
export declare const createRequest: (baseUrl: string, defaultOptions?: RequestOptions) => <TResponseData>(payload: RequestFunctionParams, options?: RequestOptions & AxiosRequestOptions) => Promise<TResponseData>;
export {};
