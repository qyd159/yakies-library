/**
 * Data processing class, can be configured according to the project
 */
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { RequestOptions, Result } from '../../../types';

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string;
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
  instance?: AxiosInstance;
}

export abstract class AxiosTransform {
  /**
   * @description: Process configuration before request
   * @description: Process configuration before request
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

  /**
   * @description: Request successfully processed
   */
  transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: InternalAxiosRequestConfig, options: CreateAxiosOptions) => InternalAxiosRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: Error) => void;
  /**
   * @description: 请求不管成功失败都走
   */
  responseHook?: (config: AxiosRequestConfig, options: RequestOptions) => void;
}
