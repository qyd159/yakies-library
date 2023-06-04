import type { AxiosRequestConfig } from 'axios';
import type { RequestFunctionParams } from 'yapi-to-typescript';
import { Method } from 'yapi-to-typescript';
import { defHttp } from '/@/utils/http/axios';
import type { RequestOptions as axioRequestOptions } from '/#/axios';
import { fromPairs } from 'lodash-es';

export interface RequestOptions {
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
  headers?: Recordable;
  fileUpload?: boolean;
  axiosOptions?: AxiosRequestConfig;
}

export default function request<TResponseData>(
  payload: RequestFunctionParams,
  options: RequestOptions & axioRequestOptions = {
    server: 'prod',
    fileUpload: false,
  }
): Promise<TResponseData> {
  return new Promise<TResponseData>(async (resolve, reject) => {
    // 基本地址
    const baseUrl = options.server === 'mock' ? payload.mockUrl : options.server === 'dev' ? payload.devUrl : payload.prodUrl;
    const { server: _server, fileUpload, axiosOptions, ...customOptions } = options;

    // 请求地址
    const url = `${baseUrl}${payload.path.indexOf('?') !== -1 ? payload.path.substring(0, payload.path.indexOf('?')) : payload.path}`.replace(
      /\{(.*?)\}/g,
      function (_match, _$1) {
        return payload.rawData as unknown as string;
      }
    );
    let request;
    switch (payload.method) {
      case Method.GET:
        request = defHttp.get(
          {
            url,
            params: fromPairs(payload.queryNames.map((key) => [key, payload.rawData?.[key]])),
            headers: options.headers,
          },
          customOptions
        );
        break;
      case Method.POST:
        if (fileUpload) {
          request = defHttp.uploadFile({ url }, { file: payload.rawData.file, ...payload.rawData }, customOptions);
        } else {
          request = defHttp.post({ url, data: payload.rawData, ...(axiosOptions || {}) }, customOptions);
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
    try {
      const data = await request;
      // 具体请求逻辑
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}
