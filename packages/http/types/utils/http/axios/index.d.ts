import type { AxiosRequestConfig } from 'axios';
import type { RequestOptions, Result } from '../../../types';
import type { CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
declare type Recordable<T = any> = Record<string, T>;
export declare class RequestError extends Error {
    constructor(message: string, data: any);
    data: any;
}
export declare function createAxios(opt?: Partial<CreateAxiosOptions>): VAxios;
declare const defHttp: VAxios;
export default defHttp;
export { RequestOptions, Result, Recordable, AxiosRequestConfig };
