import type { AxiosRequestConfig, AxiosInstance } from 'axios';
import type { RequestOptions, UploadFileParams } from '../../../types';
import type { CreateAxiosOptions } from './axiosTransform';
export * from './axiosTransform';
/**
 * @description:  axios module
 */
export declare class VAxios {
    private axiosInstance;
    private readonly options;
    constructor(options: CreateAxiosOptions);
    /**
     * @description:  Create axios instance
     */
    private createAxios;
    private getTransform;
    getAxios(): AxiosInstance;
    /**
     * @description: Reconfigure axios
     */
    configAxios(config: CreateAxiosOptions): void;
    /**
     * @description: Set general header
     */
    setHeader(headers: any): void;
    /**
     * @description: Interceptor configuration
     */
    private setupInterceptors;
    /**
     * 文件上传
     */
    uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams, options?: RequestOptions): Promise<T>;
    supportFormData(config: AxiosRequestConfig): any;
    get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
    post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
    put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
    delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
    patch<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
    request<T = any>(config: AxiosRequestConfig & {
        success?: any;
    }, options?: RequestOptions): Promise<T>;
}
