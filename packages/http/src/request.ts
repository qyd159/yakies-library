import type { AxiosRequestConfig } from 'axios';
import type { RequestFunctionParams } from 'yapi-to-typescript';
import { Method } from 'yapi-to-typescript';
import defHttp from './';
import {RequestOptions as AxiosRequestOptions} from './types'
import { fromPairs, get } from 'lodash-es';

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
  errorCaptured?: (err) => void,
}

export const createRequest = (baseUrl: string) => <TResponseData>(
  payload: RequestFunctionParams,
  options: RequestOptions & AxiosRequestOptions= {
    server: 'prod',
    fileUpload: false,
    axiosOptions: {timeout: 180 * 1000}
  },
): Promise<TResponseData>  => {
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
    const {
      server: _server,
      fileUpload,
      axiosOptions,
      ...customOptions
    } = options;

    // 请求地址
    const url = `${baseUrl}${
      payload.path.indexOf('?') !== -1
        ? payload.path.substring(0, payload.path.indexOf('?'))
        : payload.path
    }`.replace(/\{(.*?)\}/g, function (_match, _$1) {
      return payload.rawData as unknown as string;
    });
    let request: Promise<any>;
    switch (payload.method) {
      case Method.GET:
        request = defHttp.get(
          {
            url,
            params: fromPairs(
              payload.queryNames.map((key) => [key, payload.rawData?.[key]]),
            ),
          },
          customOptions,
        );
        break;
      case Method.POST:
        if (fileUpload) {
          request = defHttp.uploadFile(
            { url, ...(axiosOptions || {}) },
            { file: payload.rawData.file, ...payload.rawData },
            customOptions,
          );
        } else {
          request = defHttp.post(
            { url, data: payload.rawData, ...(axiosOptions || {}) },
            customOptions,
          );
        }
        break;
      case Method.PUT:
        request = defHttp.put({ url, data: payload.rawData });
        break;
      case Method.PATCH:
        request = defHttp.patch({ url, data: payload.rawData });
        break;
      case Method.DELETE:
        request = defHttp.delete({ url, params: payload.rawData });
        break;
      default:
        break;
    }
    request!
      .then(
        (data) => {
          // 具体请求逻辑
          resolve(options.dataKey ? get(data.data, options.dataKey) : data);
        },
        (e) => {
          reject(e);
        },
      )
      .catch((e) => {
        options.errorCaptured?.(e)
        reject(e);
      });
  });
}
