import type { AxiosRequestConfig } from 'axios';
import type { RequestFunctionParams } from 'yapi-to-typescript';
import { Method } from 'yapi-to-typescript';
import defHttp from '.';
import { RequestOptions as AxiosRequestOptions } from './types';
import { fromPairs, get, merge } from 'lodash';

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
  // 是否文件上传
  fileUpload?: boolean;
  axiosOptions?: AxiosRequestConfig;
  errorCaptured?: (err) => void;
  baseUrl?: string;
}

export const createRequest =
  (
    baseUrl: string,
    defaultOptions: RequestOptions & AxiosRequestOptions = {
      server: 'prod',
      fileUpload: false,
      axiosOptions: { timeout: 180 * 1000 },
    }
  ) =>
  <TResponseData>(payload: RequestFunctionParams, options: RequestOptions & AxiosRequestOptions = defaultOptions): Promise<TResponseData> => {
    options = merge({}, defaultOptions, options);
    return new Promise<TResponseData>((resolve, reject) => {
      // 基本地址
      // const baseUrl =
      //   options.server === 'mock'
      //     ? payload.mockUrl
      //     : options.server === 'dev'
      //     ? payload.devUrl
      //     : payload.prodUrl;
      // const baseUrl = 'http://yakies.cn:17860';
      // const baseUrl = 'https://sd.yakies.cn';
      const { server: _server, fileUpload, axiosOptions, ...customOptions } = options;

      // 请求地址
      const url = `${options.baseUrl ?? baseUrl}${
        payload.path.indexOf('?') !== -1 ? payload.path.substring(0, payload.path.indexOf('?')) : payload.path
      }`.replace(/\{(.*?)\}/g, function (_match, _$1) {
        return payload.rawData as unknown as string;
      });
      const vAxios = options.axiosInstance || defHttp;
      let request: Promise<any>;
      switch (payload.method) {
        case Method.GET:
          request = vAxios.get(
            {
              url,
              ...(axiosOptions || {}),
              params: fromPairs(payload.queryNames.map((key) => [key, payload.rawData?.[key]])),
            },
            customOptions
          );
          break;
        case Method.POST:
          if (fileUpload) {
            const { file, filePropertyName, ...data } = payload.rawData;
            request = vAxios.uploadFile({ url, ...(axiosOptions || {}) }, { file, filePropertyName, data }, customOptions);
          } else {
            request = vAxios.post({ url, data: payload.rawData, ...(axiosOptions || {}) }, customOptions);
          }
          break;
        case Method.PUT:
          request = vAxios.put({ url, data: payload.rawData, ...(axiosOptions || {}) }, customOptions);
          break;
        case Method.PATCH:
          request = vAxios.patch({ url, data: payload.rawData, ...(axiosOptions || {}) }, customOptions);
          break;
        case Method.DELETE:
          request = vAxios.delete({ url, params: payload.rawData, ...(axiosOptions || {}) }, customOptions);
          break;
        default:
          break;
      }
      request!
        .then(
          (data) => {
            if (options.isReturnNativeResponse || (typeof options.isTransformResponse !== 'undefined' && !options.isTransformResponse)) {
              resolve(data);
            } else {
              let { result } = data;
              if (!result) {
                result = data.data;
              }
              if (options.dataKey) {
                resolve(get(data, options.dataKey));
              } else {
                resolve(result);
              }
            }
          },
          (e) => {
            options.errorCaptured?.(e);
            reject(e);
          }
        )
        .catch((e) => {
          options.errorCaptured?.(e);
          reject(e);
        });
    });
  };
