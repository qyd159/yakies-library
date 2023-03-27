import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import {
  getRefreshTokenFromLocal,
  setTokenToLocal,
  getTokenFromLocal
} from './token';
import { isEmpty } from 'lodash'

const UNKNOWN_ERROR = '未知错误，请重试';

export type RequestConfig = AxiosRequestConfig & {
  /** 当前接口权限, 不需要鉴权的接口请忽略， 格式：sys:user:add */
  permCode?: string;
  /** 是否直接获取data，而忽略message等 */
  isGetDataDirectly?: boolean;
  /** 是否直接获取全部数据 */
  isFullResponse?: boolean;
  /** 请求成功是提示信息 */
  successMsg?: string;
  /** 请求失败是提示信息 */
  errorMsg?: string;
  /** 是否mock数据请求 */
  isMock?: boolean;
};

export type Response<T = any> = {
  code: number;
  message: string;
  data: T;
};

export type BaseResponse<T = any> = Promise<Response<T>>;

let isRefreshing = false;
let requests = [],
  tokenExpireFunc: () => void;

export function setTokenExpireFunc(func: () => void) {
  tokenExpireFunc = func;
}

type MessageTool = { success: (...args: any[]) => void; error: (...args: any) => void }

let Message: MessageTool = { success: console.log, error: console.error }

export function setMessageTool(messageTool: MessageTool) {
  Message = messageTool
}
export interface Request<T> extends Promise<T> {
  /**
   * 中止请求
   */
  abort(message?: string): void;
}

export let client: AxiosInstance;

export function createHTTPClient(baseURL: string, timeout = 60000) {
  client = axios.create({
    timeout, // 超时时间一分钟
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      //@ts-ignore
      request_from: 'admin',
    },
    withCredentials: true,
  });

  client.interceptors.request.use((config) => {
    const token = getTokenFromLocal();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      return response
    },
    async (err) => {
      if (err.response?.status == 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const res = await axios.post(`/api/auth/token/refresh`, {
              refreshToken: getRefreshTokenFromLocal(),
            });
            const token = res.data.token;
            setTokenToLocal(token);
            err.response.config.headers.Authorization = `${token}`;
            requests.forEach((cb) => cb(token));
            requests = [];

            return axios(err.response.config);
          } catch {
            tokenExpireFunc();
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise((resolve) => {
            // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
            requests.push((token) => {
              err.response.config.headers.Authorization = `${token}`;
              resolve(client(err.response.config));
            });
          });
        }

        return false;
      }
      if (err.response?.status >= 500) {
        Message.error('服务器错误');
      }
      if (err.response?.data?.error?.indexOf('token') >= 0) {
        Message.error('登录失效，请重新登录');
        // TODO 尝试刷新token
        // refreshToken().then((res) => {
        //   console.log(res);
        // });
        tokenExpireFunc();
        return false;
      }
      return Promise.reject(err.response);
    }
  );

  function http<Response = any>(config: RequestConfig) {
    const source = axios.CancelToken.source();
    const p = new Promise<Response>((resolve, reject) => {
      (async () => {
        let data: Response;
        let error: any;
        let headers: any;
        const {
          successMsg,
          errorMsg,
          permCode,
          isMock,
          isGetDataDirectly = false,
          isFullResponse = false
        } = config;
        // 如果当前是需要鉴权的接口 并且没有权限的话 则终止请求发起
        // if (permCode && !useUserStore().perms.includes(permCode)) {
        //   return $message.error('你没有访问该接口的权限，请联系管理员！');
        // }

        try {
          config.cancelToken = source.token;
          const response: AxiosResponse = await client(config);
          if (isFullResponse) {
            resolve(response.data)
            return;
          }

          const res = response.data;

          // if the custom code is not 200, it is judged as an error.
          if (res.code !== 200) {
            Message.error(res.message || UNKNOWN_ERROR);

            // Illegal token
            if (res.code === 11001 || res.code === 11002) {
              window.localStorage.clear();
              window.location.reload();
              // to re-login
              // Modal.confirm({
              //   title: '警告',
              //   content: res.message || '账号异常，您可以取消停留在该页上，或重新登录',
              //   okText: '重新登录',
              //   cancelText: '取消',
              //   onOk: () => {
              //     localStorage.clear();
              //     window.location.reload();
              //   }
              // });
            }

            // throw other
            const error = new Error(res.message || UNKNOWN_ERROR) as Error & {
              code: any;
            };
            error.code = res.code;
            throw error;
          }
          if (response.headers['content-disposition']) {
            response.data.headers = response.headers['content-disposition'];
          }
          data = response.data.data;
        } catch (e: any) {
          error = e;
        }
        if (!error) {
          successMsg && Message.success(successMsg);
        } else {
          errorMsg && Message.error(errorMsg);
          reject(error);
          return;
        }
        //@ts-ignore
        resolve(isGetDataDirectly ? data.data : data);
      })();
    }) as Request<Response>;
    p.abort = (message) => source.cancel(message);
    return p;
  };

  const request = {
    GET<Response>(
      url: string,
      query: Record<string, any> = {},
      options?: RequestConfig
    ): Request<Response> {
      return http<Response>({
        url: url + (isEmpty(query) ? '' : '?' + new URLSearchParams(query).toString()),
        ...options,
      });
    },
    POST<Response>(
      url: string,
      data: unknown,
      options?: RequestConfig
    ): Request<Response> {
      return http<Response>({
        url: url,
        method: 'post',
        data,
        ...options,
      });
    },
    PUT<Response>(
      url: string,
      data: unknown,
      options?: RequestConfig
    ): Request<Response> {
      return http<Response>({
        url: url,
        method: 'put',
        data,
        ...options,
      });
    },
    PATCH<Response>(
      url: string,
      data: unknown,
      options?: RequestConfig
    ): Request<Response> {
      return http<Response>({
        url: url,
        method: 'patch',
        data,
        ...options,
      });
    },
    DEL<Response>(
      url: string,
      query: Record<string, any> = {},
      options?: RequestConfig
    ): Request<Response> {
      return http<Response>({
        url: url + (isEmpty(query) ? '' : '?' + new URLSearchParams(query).toString()),
        method: 'delete',
        ...options,
      });
    },
    DEL2<Response>(
      url: string,
      data: unknown,
      options?: RequestConfig
    ): Request<Response> {
      return http<Response>({
        url: url,
        data,
        method: 'delete',
        ...options,
      });
    }
  }

  return request
}

export * from './token'

export type RequestInstance = ReturnType<typeof createHTTPClient>
