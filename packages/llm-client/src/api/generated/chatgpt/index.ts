/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

// @ts-ignore
// prettier-ignore
import { QueryStringArrayFormat, Method, RequestBodyType, ResponseBodyType, FileData, prepare } from 'yapi-to-typescript'
// @ts-ignore
// prettier-ignore
import type { RequestConfig, RequestFunctionRestArgs } from 'yapi-to-typescript'
// @ts-ignore
import request from './request';

type UserRequestRestArgs = RequestFunctionRestArgs<typeof request>;

// Request: 目前 React Hooks 功能有用到
export type Request<TRequestData, TRequestConfig extends RequestConfig, TRequestResult> = (TRequestConfig['requestDataOptional'] extends true
  ? (requestData?: TRequestData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult
  : (requestData: TRequestData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult) & {
  requestConfig: TRequestConfig;
};

const mockUrl_0_0_0_0 = 'http://127.0.0.1:50505/mock/0' as any;
const devUrl_0_0_0_0 = '' as any;
const prodUrl_0_0_0_0 = '' as any;
const dataKey_0_0_0_0 = 'data' as any;

/**
 * 接口 \/ 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /`
 */
export interface FetchHelloWorldRequest {}

/**
 * 接口 \/ 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /`
 */
export type FetchHelloWorldResponse = string;

/**
 * 接口 \/ 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /`
 */
type FetchHelloWorldRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/', 'data', string, string, true>>;

/**
 * 接口 \/ 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /`
 */
const fetchHelloWorldRequestConfig: FetchHelloWorldRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchHelloWorld',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/ 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /`
 */
export const fetchHelloWorld = /*#__PURE__*/ (requestData?: FetchHelloWorldRequest, ...args: UserRequestRestArgs) => {
  return request<FetchHelloWorldResponse>(prepare(fetchHelloWorldRequestConfig, requestData), ...args);
};

fetchHelloWorld.requestConfig = fetchHelloWorldRequestConfig;

/**
 * 接口 \/ 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /`
 */
export interface CreateHelloWorldRequest {
  /**
   * 当前会话id
   */
  session_id?: number;
}

/**
 * 接口 \/ 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /`
 */
export type CreateHelloWorldResponse = number;

/**
 * 接口 \/ 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /`
 */
type CreateHelloWorldRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/', 'data', string, string, false>>;

/**
 * 接口 \/ 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /`
 */
const createHelloWorldRequestConfig: CreateHelloWorldRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createHelloWorld',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/ 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /`
 */
export const createHelloWorld = /*#__PURE__*/ (requestData: CreateHelloWorldRequest, ...args: UserRequestRestArgs) => {
  return request<CreateHelloWorldResponse>(prepare(createHelloWorldRequestConfig, requestData), ...args);
};

createHelloWorld.requestConfig = createHelloWorldRequestConfig;

/**
 * 接口 \/test 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /test`
 */
export interface FetchTestRequest {}

/**
 * 接口 \/test 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /test`
 */
export interface FetchTestResponse {}

/**
 * 接口 \/test 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /test`
 */
type FetchTestRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/test', 'data', string, string, true>>;

/**
 * 接口 \/test 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /test`
 */
const fetchTestRequestConfig: FetchTestRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/test',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchTest',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/test 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /test`
 */
export const fetchTest = /*#__PURE__*/ (requestData?: FetchTestRequest, ...args: UserRequestRestArgs) => {
  return request<FetchTestResponse>(prepare(fetchTestRequestConfig, requestData), ...args);
};

fetchTest.requestConfig = fetchTestRequestConfig;

/**
 * 接口 \/text2img 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /text2img`
 */
export interface CreateText2imgRequest {
  /**
   * 提示词
   */
  prompt: string;
  /**
   * 模型
   */
  model: string;
  /**
   * 模型分组
   */
  cat: string;
  /**
   * 对话
   */
  dialog_id: number;
  /**
   * 图片宽
   */
  width: number;
  /**
   * 图片高
   */
  height: number;
}

/**
 * 接口 \/text2img 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /text2img`
 */
export type CreateText2imgResponse = any;

/**
 * 接口 \/text2img 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /text2img`
 */
type CreateText2imgRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/text2img', 'data', string, string, false>>;

/**
 * 接口 \/text2img 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /text2img`
 */
const createText2imgRequestConfig: CreateText2imgRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/text2img',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createText2img',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/text2img 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /text2img`
 */
export const createText2img = /*#__PURE__*/ (requestData: CreateText2imgRequest, ...args: UserRequestRestArgs) => {
  return request<CreateText2imgResponse>(prepare(createText2imgRequestConfig, requestData), ...args);
};

createText2img.requestConfig = createText2imgRequestConfig;

/**
 * 接口 \/test\/function_calling 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /test/function_calling`
 */
export interface FetchTestFunctionCallingRequest {}

/**
 * 接口 \/test\/function_calling 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /test/function_calling`
 */
export type FetchTestFunctionCallingResponse = any;

/**
 * 接口 \/test\/function_calling 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /test/function_calling`
 */
type FetchTestFunctionCallingRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/test/function_calling', 'data', string, string, true>
>;

/**
 * 接口 \/test\/function_calling 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /test/function_calling`
 */
const fetchTestFunctionCallingRequestConfig: FetchTestFunctionCallingRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/test/function_calling',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchTestFunctionCalling',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/test\/function_calling 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /test/function_calling`
 */
export const fetchTestFunctionCalling = /*#__PURE__*/ (requestData?: FetchTestFunctionCallingRequest, ...args: UserRequestRestArgs) => {
  return request<FetchTestFunctionCallingResponse>(prepare(fetchTestFunctionCallingRequestConfig, requestData), ...args);
};

fetchTestFunctionCalling.requestConfig = fetchTestFunctionCallingRequestConfig;

/**
 * 接口 \/asr 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /asr`
 */
export interface FetchAsrRequest {}

/**
 * 接口 \/asr 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /asr`
 */
export type FetchAsrResponse = string;

/**
 * 接口 \/asr 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /asr`
 */
type FetchAsrRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/asr', 'data', string, string, true>>;

/**
 * 接口 \/asr 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /asr`
 */
const fetchAsrRequestConfig: FetchAsrRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/asr',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchAsr',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/asr 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /asr`
 */
export const fetchAsr = /*#__PURE__*/ (requestData?: FetchAsrRequest, ...args: UserRequestRestArgs) => {
  return request<FetchAsrResponse>(prepare(fetchAsrRequestConfig, requestData), ...args);
};

fetchAsr.requestConfig = fetchAsrRequestConfig;

/**
 * 接口 \/chat 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /chat`
 */
export interface CreateChatRequest {
  question: string;
  answer?: {};
  chatgpt_id?: string;
  request_id?: string;
  model?: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  aborted?: boolean;
  collected?: boolean;
  liked?: boolean;
  published?: boolean;
  completed_at?: string;
  messages?: {};
  contextual?: boolean;
  mark_del?: boolean;
  content?: string;
  cat?: string;
}

/**
 * 接口 \/chat 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /chat`
 */
export type CreateChatResponse = any;

/**
 * 接口 \/chat 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /chat`
 */
type CreateChatRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/chat', 'data', string, string, false>>;

/**
 * 接口 \/chat 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /chat`
 */
const createChatRequestConfig: CreateChatRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/chat',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createChat',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/chat 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /chat`
 */
export const createChat = /*#__PURE__*/ (requestData: CreateChatRequest, ...args: UserRequestRestArgs) => {
  return request<CreateChatResponse>(prepare(createChatRequestConfig, requestData), ...args);
};

createChat.requestConfig = createChatRequestConfig;

/**
 * 接口 \/chat 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /chat`
 */
export interface FetchChatRequest {
  /**
   * 当前页包含数量
   */
  limit?: string;
  /**
   * 当前页包含数量
   */
  page?: string;
  s?: string;
  user?: string;
  model?: string;
  category?: string;
  dialog_id?: string;
}

/**
 * 接口 \/chat 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /chat`
 */
export type FetchChatResponse = any;

/**
 * 接口 \/chat 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /chat`
 */
type FetchChatRequestConfig = Readonly<
  RequestConfig<
    'http://127.0.0.1:50505/mock/0',
    '',
    '',
    '/chat',
    'data',
    string,
    'limit' | 'page' | 's' | 'user' | 'model' | 'category' | 'dialog_id',
    false
  >
>;

/**
 * 接口 \/chat 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /chat`
 */
const fetchChatRequestConfig: FetchChatRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/chat',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: ['limit', 'page', 's', 'user', 'model', 'category', 'dialog_id'],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchChat',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/chat 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /chat`
 */
export const fetchChat = /*#__PURE__*/ (requestData: FetchChatRequest, ...args: UserRequestRestArgs) => {
  return request<FetchChatResponse>(prepare(fetchChatRequestConfig, requestData), ...args);
};

fetchChat.requestConfig = fetchChatRequestConfig;

/**
 * 接口 \/chat 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /chat`
 */
export interface DelChatRequest {}

/**
 * 接口 \/chat 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /chat`
 */
export interface DelChatResponse {}

/**
 * 接口 \/chat 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `DELETE /chat`
 */
type DelChatRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/chat', 'data', string, string, true>>;

/**
 * 接口 \/chat 的 **请求配置**
 *
 * @分类 default
 * @请求头 `DELETE /chat`
 */
const delChatRequestConfig: DelChatRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/chat',
  method: Method.DELETE,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'delChat',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/chat 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /chat`
 */
export const delChat = /*#__PURE__*/ (requestData?: DelChatRequest, ...args: UserRequestRestArgs) => {
  return request<DelChatResponse>(prepare(delChatRequestConfig, requestData), ...args);
};

delChat.requestConfig = delChatRequestConfig;

/**
 * 接口 \/chat\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /chat/{id}`
 */
export interface FetchChatIdRequest {
  id: string;
}

/**
 * 接口 \/chat\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /chat/{id}`
 */
export type FetchChatIdResponse = any;

/**
 * 接口 \/chat\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /chat/{id}`
 */
type FetchChatIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/chat/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/chat\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /chat/{id}`
 */
const fetchChatIdRequestConfig: FetchChatIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/chat/{id}',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchChatId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/chat\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /chat/{id}`
 */
export const fetchChatId = /*#__PURE__*/ (requestData: FetchChatIdRequest, ...args: UserRequestRestArgs) => {
  return request<FetchChatIdResponse>(prepare(fetchChatIdRequestConfig, requestData), ...args);
};

fetchChatId.requestConfig = fetchChatIdRequestConfig;

/**
 * 接口 \/chat\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `PATCH /chat/{id}`
 */
export interface PatchChatIdRequest {
  question?: string;
  answer?: {};
  chatgpt_id?: string;
  request_id?: string;
  model?: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  aborted?: boolean;
  collected?: boolean;
  liked?: boolean;
  published?: boolean;
  completed_at?: string;
  messages?: {};
  contextual?: boolean;
  mark_del?: boolean;
  content?: string;
  cat?: string;
  id: string;
}

/**
 * 接口 \/chat\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `PATCH /chat/{id}`
 */
export type PatchChatIdResponse = any;

/**
 * 接口 \/chat\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `PATCH /chat/{id}`
 */
type PatchChatIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/chat/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/chat\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `PATCH /chat/{id}`
 */
const patchChatIdRequestConfig: PatchChatIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/chat/{id}',
  method: Method.PATCH,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'patchChatId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/chat\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /chat/{id}`
 */
export const patchChatId = /*#__PURE__*/ (requestData: PatchChatIdRequest, ...args: UserRequestRestArgs) => {
  return request<PatchChatIdResponse>(prepare(patchChatIdRequestConfig, requestData), ...args);
};

patchChatId.requestConfig = patchChatIdRequestConfig;

/**
 * 接口 \/chat\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /chat/{id}`
 */
export interface DelChatIdRequest {
  id: string;
}

/**
 * 接口 \/chat\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /chat/{id}`
 */
export type DelChatIdResponse = any;

/**
 * 接口 \/chat\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `DELETE /chat/{id}`
 */
type DelChatIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/chat/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/chat\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `DELETE /chat/{id}`
 */
const delChatIdRequestConfig: DelChatIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/chat/{id}',
  method: Method.DELETE,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'delChatId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/chat\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /chat/{id}`
 */
export const delChatId = /*#__PURE__*/ (requestData: DelChatIdRequest, ...args: UserRequestRestArgs) => {
  return request<DelChatIdResponse>(prepare(delChatIdRequestConfig, requestData), ...args);
};

delChatId.requestConfig = delChatIdRequestConfig;

/**
 * 接口 \/chat\/top\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `PATCH /chat/top/{id}`
 */
export interface PatchChatTopIdRequest {
  id: string;
}

/**
 * 接口 \/chat\/top\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `PATCH /chat/top/{id}`
 */
export type PatchChatTopIdResponse = any;

/**
 * 接口 \/chat\/top\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `PATCH /chat/top/{id}`
 */
type PatchChatTopIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/chat/top/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/chat\/top\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `PATCH /chat/top/{id}`
 */
const patchChatTopIdRequestConfig: PatchChatTopIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/chat/top/{id}',
  method: Method.PATCH,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'patchChatTopId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/chat\/top\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /chat/top/{id}`
 */
export const patchChatTopId = /*#__PURE__*/ (requestData: PatchChatTopIdRequest, ...args: UserRequestRestArgs) => {
  return request<PatchChatTopIdResponse>(prepare(patchChatTopIdRequestConfig, requestData), ...args);
};

patchChatTopId.requestConfig = patchChatTopIdRequestConfig;

/**
 * 接口 \/chat\/adjacent 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /chat/adjacent`
 */
export interface FetchChatAdjacentRequest {
  dialog_id: string;
  id: string;
  total: string;
}

/**
 * 接口 \/chat\/adjacent 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /chat/adjacent`
 */
export type FetchChatAdjacentResponse = any;

/**
 * 接口 \/chat\/adjacent 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /chat/adjacent`
 */
type FetchChatAdjacentRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/chat/adjacent', 'data', string, 'dialog_id' | 'id' | 'total', false>
>;

/**
 * 接口 \/chat\/adjacent 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /chat/adjacent`
 */
const fetchChatAdjacentRequestConfig: FetchChatAdjacentRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/chat/adjacent',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: ['dialog_id', 'id', 'total'],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchChatAdjacent',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/chat\/adjacent 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /chat/adjacent`
 */
export const fetchChatAdjacent = /*#__PURE__*/ (requestData: FetchChatAdjacentRequest, ...args: UserRequestRestArgs) => {
  return request<FetchChatAdjacentResponse>(prepare(fetchChatAdjacentRequestConfig, requestData), ...args);
};

fetchChatAdjacent.requestConfig = fetchChatAdjacentRequestConfig;

/**
 * 接口 \/dialog 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /dialog`
 */
export interface CreateDialogRequest {
  name: string;
  model: string;
}

/**
 * 接口 \/dialog 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /dialog`
 */
export type CreateDialogResponse = string;

/**
 * 接口 \/dialog 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /dialog`
 */
type CreateDialogRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/dialog', 'data', string, string, false>>;

/**
 * 接口 \/dialog 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /dialog`
 */
const createDialogRequestConfig: CreateDialogRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/dialog',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createDialog',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/dialog 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /dialog`
 */
export const createDialog = /*#__PURE__*/ (requestData: CreateDialogRequest, ...args: UserRequestRestArgs) => {
  return request<CreateDialogResponse>(prepare(createDialogRequestConfig, requestData), ...args);
};

createDialog.requestConfig = createDialogRequestConfig;

/**
 * 接口 \/dialog 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /dialog`
 */
export interface FetchDialogRequest {
  /**
   * 当前页包含数量
   */
  limit?: string;
  /**
   * 当前页包含数量
   */
  page?: string;
}

/**
 * 接口 \/dialog 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /dialog`
 */
export type FetchDialogResponse = any;

/**
 * 接口 \/dialog 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /dialog`
 */
type FetchDialogRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/dialog', 'data', string, 'limit' | 'page', false>>;

/**
 * 接口 \/dialog 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /dialog`
 */
const fetchDialogRequestConfig: FetchDialogRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/dialog',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: ['limit', 'page'],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchDialog',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/dialog 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /dialog`
 */
export const fetchDialog = /*#__PURE__*/ (requestData: FetchDialogRequest, ...args: UserRequestRestArgs) => {
  return request<FetchDialogResponse>(prepare(fetchDialogRequestConfig, requestData), ...args);
};

fetchDialog.requestConfig = fetchDialogRequestConfig;

/**
 * 接口 \/dialog\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /dialog/{id}`
 */
export interface FetchDialogIdRequest {
  id: string;
}

/**
 * 接口 \/dialog\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /dialog/{id}`
 */
export type FetchDialogIdResponse = string;

/**
 * 接口 \/dialog\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /dialog/{id}`
 */
type FetchDialogIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/dialog/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/dialog\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /dialog/{id}`
 */
const fetchDialogIdRequestConfig: FetchDialogIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/dialog/{id}',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchDialogId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/dialog\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /dialog/{id}`
 */
export const fetchDialogId = /*#__PURE__*/ (requestData: FetchDialogIdRequest, ...args: UserRequestRestArgs) => {
  return request<FetchDialogIdResponse>(prepare(fetchDialogIdRequestConfig, requestData), ...args);
};

fetchDialogId.requestConfig = fetchDialogIdRequestConfig;

/**
 * 接口 \/dialog\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `PATCH /dialog/{id}`
 */
export interface PatchDialogIdRequest {
  name?: string;
  model?: string;
  id: string;
}

/**
 * 接口 \/dialog\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `PATCH /dialog/{id}`
 */
export type PatchDialogIdResponse = string;

/**
 * 接口 \/dialog\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `PATCH /dialog/{id}`
 */
type PatchDialogIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/dialog/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/dialog\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `PATCH /dialog/{id}`
 */
const patchDialogIdRequestConfig: PatchDialogIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/dialog/{id}',
  method: Method.PATCH,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'patchDialogId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/dialog\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /dialog/{id}`
 */
export const patchDialogId = /*#__PURE__*/ (requestData: PatchDialogIdRequest, ...args: UserRequestRestArgs) => {
  return request<PatchDialogIdResponse>(prepare(patchDialogIdRequestConfig, requestData), ...args);
};

patchDialogId.requestConfig = patchDialogIdRequestConfig;

/**
 * 接口 \/dialog\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /dialog/{id}`
 */
export interface DelDialogIdRequest {
  id: string;
}

/**
 * 接口 \/dialog\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /dialog/{id}`
 */
export type DelDialogIdResponse = any;

/**
 * 接口 \/dialog\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `DELETE /dialog/{id}`
 */
type DelDialogIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/dialog/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/dialog\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `DELETE /dialog/{id}`
 */
const delDialogIdRequestConfig: DelDialogIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/dialog/{id}',
  method: Method.DELETE,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'delDialogId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/dialog\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /dialog/{id}`
 */
export const delDialogId = /*#__PURE__*/ (requestData: DelDialogIdRequest, ...args: UserRequestRestArgs) => {
  return request<DelDialogIdResponse>(prepare(delDialogIdRequestConfig, requestData), ...args);
};

delDialogId.requestConfig = delDialogIdRequestConfig;

/**
 * 接口 \/tag 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /tag`
 */
export interface CreateTagRequest {
  name: string;
}

/**
 * 接口 \/tag 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /tag`
 */
export type CreateTagResponse = string;

/**
 * 接口 \/tag 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /tag`
 */
type CreateTagRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/tag', 'data', string, string, false>>;

/**
 * 接口 \/tag 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /tag`
 */
const createTagRequestConfig: CreateTagRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/tag',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createTag',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/tag 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /tag`
 */
export const createTag = /*#__PURE__*/ (requestData: CreateTagRequest, ...args: UserRequestRestArgs) => {
  return request<CreateTagResponse>(prepare(createTagRequestConfig, requestData), ...args);
};

createTag.requestConfig = createTagRequestConfig;

/**
 * 接口 \/tag 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /tag`
 */
export interface FetchTagRequest {}

/**
 * 接口 \/tag 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /tag`
 */
export type FetchTagResponse = string;

/**
 * 接口 \/tag 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /tag`
 */
type FetchTagRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/tag', 'data', string, string, true>>;

/**
 * 接口 \/tag 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /tag`
 */
const fetchTagRequestConfig: FetchTagRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/tag',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchTag',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/tag 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /tag`
 */
export const fetchTag = /*#__PURE__*/ (requestData?: FetchTagRequest, ...args: UserRequestRestArgs) => {
  return request<FetchTagResponse>(prepare(fetchTagRequestConfig, requestData), ...args);
};

fetchTag.requestConfig = fetchTagRequestConfig;

/**
 * 接口 \/tag\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /tag/{id}`
 */
export interface FetchTagIdRequest {
  id: string;
}

/**
 * 接口 \/tag\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /tag/{id}`
 */
export type FetchTagIdResponse = string;

/**
 * 接口 \/tag\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /tag/{id}`
 */
type FetchTagIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/tag/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/tag\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /tag/{id}`
 */
const fetchTagIdRequestConfig: FetchTagIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/tag/{id}',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchTagId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/tag\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /tag/{id}`
 */
export const fetchTagId = /*#__PURE__*/ (requestData: FetchTagIdRequest, ...args: UserRequestRestArgs) => {
  return request<FetchTagIdResponse>(prepare(fetchTagIdRequestConfig, requestData), ...args);
};

fetchTagId.requestConfig = fetchTagIdRequestConfig;

/**
 * 接口 \/tag\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `PATCH /tag/{id}`
 */
export interface PatchTagIdRequest {
  name?: string;
  id: string;
}

/**
 * 接口 \/tag\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `PATCH /tag/{id}`
 */
export type PatchTagIdResponse = string;

/**
 * 接口 \/tag\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `PATCH /tag/{id}`
 */
type PatchTagIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/tag/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/tag\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `PATCH /tag/{id}`
 */
const patchTagIdRequestConfig: PatchTagIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/tag/{id}',
  method: Method.PATCH,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'patchTagId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/tag\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /tag/{id}`
 */
export const patchTagId = /*#__PURE__*/ (requestData: PatchTagIdRequest, ...args: UserRequestRestArgs) => {
  return request<PatchTagIdResponse>(prepare(patchTagIdRequestConfig, requestData), ...args);
};

patchTagId.requestConfig = patchTagIdRequestConfig;

/**
 * 接口 \/tag\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /tag/{id}`
 */
export interface DelTagIdRequest {
  id: string;
}

/**
 * 接口 \/tag\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /tag/{id}`
 */
export type DelTagIdResponse = string;

/**
 * 接口 \/tag\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `DELETE /tag/{id}`
 */
type DelTagIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/tag/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/tag\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `DELETE /tag/{id}`
 */
const delTagIdRequestConfig: DelTagIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/tag/{id}',
  method: Method.DELETE,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'delTagId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/tag\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /tag/{id}`
 */
export const delTagId = /*#__PURE__*/ (requestData: DelTagIdRequest, ...args: UserRequestRestArgs) => {
  return request<DelTagIdResponse>(prepare(delTagIdRequestConfig, requestData), ...args);
};

delTagId.requestConfig = delTagIdRequestConfig;

/**
 * 接口 \/category 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /category`
 */
export interface CreateCategoryRequest {
  name: string;
}

/**
 * 接口 \/category 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /category`
 */
export type CreateCategoryResponse = any;

/**
 * 接口 \/category 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /category`
 */
type CreateCategoryRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/category', 'data', string, string, false>>;

/**
 * 接口 \/category 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /category`
 */
const createCategoryRequestConfig: CreateCategoryRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/category',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createCategory',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/category 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /category`
 */
export const createCategory = /*#__PURE__*/ (requestData: CreateCategoryRequest, ...args: UserRequestRestArgs) => {
  return request<CreateCategoryResponse>(prepare(createCategoryRequestConfig, requestData), ...args);
};

createCategory.requestConfig = createCategoryRequestConfig;

/**
 * 接口 \/category 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /category`
 */
export interface FetchCategoryRequest {}

/**
 * 接口 \/category 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /category`
 */
export type FetchCategoryResponse = any;

/**
 * 接口 \/category 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /category`
 */
type FetchCategoryRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/category', 'data', string, string, true>>;

/**
 * 接口 \/category 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /category`
 */
const fetchCategoryRequestConfig: FetchCategoryRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/category',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchCategory',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/category 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /category`
 */
export const fetchCategory = /*#__PURE__*/ (requestData?: FetchCategoryRequest, ...args: UserRequestRestArgs) => {
  return request<FetchCategoryResponse>(prepare(fetchCategoryRequestConfig, requestData), ...args);
};

fetchCategory.requestConfig = fetchCategoryRequestConfig;

/**
 * 接口 \/category\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /category/{id}`
 */
export interface FetchCategoryIdRequest {
  id: string;
}

/**
 * 接口 \/category\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /category/{id}`
 */
export interface FetchCategoryIdResponse {}

/**
 * 接口 \/category\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /category/{id}`
 */
type FetchCategoryIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/category/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/category\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /category/{id}`
 */
const fetchCategoryIdRequestConfig: FetchCategoryIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/category/{id}',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchCategoryId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/category\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /category/{id}`
 */
export const fetchCategoryId = /*#__PURE__*/ (requestData: FetchCategoryIdRequest, ...args: UserRequestRestArgs) => {
  return request<FetchCategoryIdResponse>(prepare(fetchCategoryIdRequestConfig, requestData), ...args);
};

fetchCategoryId.requestConfig = fetchCategoryIdRequestConfig;

/**
 * 接口 \/category\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `PATCH /category/{id}`
 */
export interface PatchCategoryIdRequest {
  name?: string;
  id: string;
}

/**
 * 接口 \/category\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `PATCH /category/{id}`
 */
export type PatchCategoryIdResponse = any;

/**
 * 接口 \/category\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `PATCH /category/{id}`
 */
type PatchCategoryIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/category/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/category\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `PATCH /category/{id}`
 */
const patchCategoryIdRequestConfig: PatchCategoryIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/category/{id}',
  method: Method.PATCH,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'patchCategoryId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/category\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /category/{id}`
 */
export const patchCategoryId = /*#__PURE__*/ (requestData: PatchCategoryIdRequest, ...args: UserRequestRestArgs) => {
  return request<PatchCategoryIdResponse>(prepare(patchCategoryIdRequestConfig, requestData), ...args);
};

patchCategoryId.requestConfig = patchCategoryIdRequestConfig;

/**
 * 接口 \/category\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /category/{id}`
 */
export interface DelCategoryIdRequest {
  id: string;
}

/**
 * 接口 \/category\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /category/{id}`
 */
export type DelCategoryIdResponse = any;

/**
 * 接口 \/category\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `DELETE /category/{id}`
 */
type DelCategoryIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/category/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/category\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `DELETE /category/{id}`
 */
const delCategoryIdRequestConfig: DelCategoryIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/category/{id}',
  method: Method.DELETE,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'delCategoryId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/category\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /category/{id}`
 */
export const delCategoryId = /*#__PURE__*/ (requestData: DelCategoryIdRequest, ...args: UserRequestRestArgs) => {
  return request<DelCategoryIdResponse>(prepare(delCategoryIdRequestConfig, requestData), ...args);
};

delCategoryId.requestConfig = delCategoryIdRequestConfig;

/**
 * 接口 \/category\/reorder 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /category/reorder`
 */
export interface CreateCategoryReorderRequest {
  ids: {}[];
  pid?: {};
}

/**
 * 接口 \/category\/reorder 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /category/reorder`
 */
export type CreateCategoryReorderResponse = string;

/**
 * 接口 \/category\/reorder 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /category/reorder`
 */
type CreateCategoryReorderRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/category/reorder', 'data', string, string, false>
>;

/**
 * 接口 \/category\/reorder 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /category/reorder`
 */
const createCategoryReorderRequestConfig: CreateCategoryReorderRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/category/reorder',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createCategoryReorder',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/category\/reorder 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /category/reorder`
 */
export const createCategoryReorder = /*#__PURE__*/ (requestData: CreateCategoryReorderRequest, ...args: UserRequestRestArgs) => {
  return request<CreateCategoryReorderResponse>(prepare(createCategoryReorderRequestConfig, requestData), ...args);
};

createCategoryReorder.requestConfig = createCategoryReorderRequestConfig;

/**
 * 接口 \/category\/bind 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /category/bind`
 */
export interface CreateCategoryBindRequest {
  chatIds: number[];
  cateId?: number;
  index?: number;
}

/**
 * 接口 \/category\/bind 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /category/bind`
 */
export type CreateCategoryBindResponse = any;

/**
 * 接口 \/category\/bind 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /category/bind`
 */
type CreateCategoryBindRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/category/bind', 'data', string, string, false>
>;

/**
 * 接口 \/category\/bind 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /category/bind`
 */
const createCategoryBindRequestConfig: CreateCategoryBindRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/category/bind',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createCategoryBind',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/category\/bind 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /category/bind`
 */
export const createCategoryBind = /*#__PURE__*/ (requestData: CreateCategoryBindRequest, ...args: UserRequestRestArgs) => {
  return request<CreateCategoryBindResponse>(prepare(createCategoryBindRequestConfig, requestData), ...args);
};

createCategoryBind.requestConfig = createCategoryBindRequestConfig;

/**
 * 接口 \/picture 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /picture`
 */
export interface CreatePictureRequest {
  user: number;
  prompt: string;
  width: number;
  height: number;
  model?: string;
  bucket?: string;
  objectKey?: string;
  downloadUrl?: string;
  url_expire_at?: string;
  completed_at?: string;
  cat?: string;
}

/**
 * 接口 \/picture 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /picture`
 */
export type CreatePictureResponse = any;

/**
 * 接口 \/picture 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /picture`
 */
type CreatePictureRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/picture', 'data', string, string, false>>;

/**
 * 接口 \/picture 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /picture`
 */
const createPictureRequestConfig: CreatePictureRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/picture',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createPicture',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/picture 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /picture`
 */
export const createPicture = /*#__PURE__*/ (requestData: CreatePictureRequest, ...args: UserRequestRestArgs) => {
  return request<CreatePictureResponse>(prepare(createPictureRequestConfig, requestData), ...args);
};

createPicture.requestConfig = createPictureRequestConfig;

/**
 * 接口 \/picture 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /picture`
 */
export interface FetchPictureRequest {
  /**
   * 当前页包含数量
   */
  limit?: string;
  /**
   * 当前页包含数量
   */
  page?: string;
  s?: string;
  user?: string;
  model?: string;
  category?: string;
  dialog_id?: string;
}

/**
 * 接口 \/picture 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /picture`
 */
export type FetchPictureResponse = any;

/**
 * 接口 \/picture 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /picture`
 */
type FetchPictureRequestConfig = Readonly<
  RequestConfig<
    'http://127.0.0.1:50505/mock/0',
    '',
    '',
    '/picture',
    'data',
    string,
    'limit' | 'page' | 's' | 'user' | 'model' | 'category' | 'dialog_id',
    false
  >
>;

/**
 * 接口 \/picture 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /picture`
 */
const fetchPictureRequestConfig: FetchPictureRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/picture',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: ['limit', 'page', 's', 'user', 'model', 'category', 'dialog_id'],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchPicture',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/picture 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /picture`
 */
export const fetchPicture = /*#__PURE__*/ (requestData: FetchPictureRequest, ...args: UserRequestRestArgs) => {
  return request<FetchPictureResponse>(prepare(fetchPictureRequestConfig, requestData), ...args);
};

fetchPicture.requestConfig = fetchPictureRequestConfig;

/**
 * 接口 \/picture\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /picture/{id}`
 */
export interface FetchPictureIdRequest {
  id: string;
}

/**
 * 接口 \/picture\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /picture/{id}`
 */
export type FetchPictureIdResponse = string;

/**
 * 接口 \/picture\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /picture/{id}`
 */
type FetchPictureIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/picture/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/picture\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /picture/{id}`
 */
const fetchPictureIdRequestConfig: FetchPictureIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/picture/{id}',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchPictureId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/picture\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /picture/{id}`
 */
export const fetchPictureId = /*#__PURE__*/ (requestData: FetchPictureIdRequest, ...args: UserRequestRestArgs) => {
  return request<FetchPictureIdResponse>(prepare(fetchPictureIdRequestConfig, requestData), ...args);
};

fetchPictureId.requestConfig = fetchPictureIdRequestConfig;

/**
 * 接口 \/picture\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `PATCH /picture/{id}`
 */
export interface PatchPictureIdRequest {
  user?: number;
  prompt?: string;
  width?: number;
  height?: number;
  model?: string;
  bucket?: string;
  objectKey?: string;
  downloadUrl?: string;
  url_expire_at?: string;
  completed_at?: string;
  cat?: string;
  id: string;
}

/**
 * 接口 \/picture\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `PATCH /picture/{id}`
 */
export type PatchPictureIdResponse = any;

/**
 * 接口 \/picture\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `PATCH /picture/{id}`
 */
type PatchPictureIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/picture/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/picture\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `PATCH /picture/{id}`
 */
const patchPictureIdRequestConfig: PatchPictureIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/picture/{id}',
  method: Method.PATCH,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'patchPictureId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/picture\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /picture/{id}`
 */
export const patchPictureId = /*#__PURE__*/ (requestData: PatchPictureIdRequest, ...args: UserRequestRestArgs) => {
  return request<PatchPictureIdResponse>(prepare(patchPictureIdRequestConfig, requestData), ...args);
};

patchPictureId.requestConfig = patchPictureIdRequestConfig;

/**
 * 接口 \/picture\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /picture/{id}`
 */
export interface DelPictureIdRequest {
  id: string;
}

/**
 * 接口 \/picture\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /picture/{id}`
 */
export type DelPictureIdResponse = any;

/**
 * 接口 \/picture\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `DELETE /picture/{id}`
 */
type DelPictureIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/picture/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/picture\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `DELETE /picture/{id}`
 */
const delPictureIdRequestConfig: DelPictureIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/picture/{id}',
  method: Method.DELETE,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'delPictureId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/picture\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /picture/{id}`
 */
export const delPictureId = /*#__PURE__*/ (requestData: DelPictureIdRequest, ...args: UserRequestRestArgs) => {
  return request<DelPictureIdResponse>(prepare(delPictureIdRequestConfig, requestData), ...args);
};

delPictureId.requestConfig = delPictureIdRequestConfig;

/**
 * 接口 \/role 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /role`
 */
export interface CreateRoleRequest {
  name: string;
  model?: string;
  instruction: string;
}

/**
 * 接口 \/role 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /role`
 */
export type CreateRoleResponse = any;

/**
 * 接口 \/role 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /role`
 */
type CreateRoleRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/role', 'data', string, string, false>>;

/**
 * 接口 \/role 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /role`
 */
const createRoleRequestConfig: CreateRoleRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/role',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createRole',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/role 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /role`
 */
export const createRole = /*#__PURE__*/ (requestData: CreateRoleRequest, ...args: UserRequestRestArgs) => {
  return request<CreateRoleResponse>(prepare(createRoleRequestConfig, requestData), ...args);
};

createRole.requestConfig = createRoleRequestConfig;

/**
 * 接口 \/role 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /role`
 */
export interface FetchRoleRequest {}

/**
 * 接口 \/role 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /role`
 */
export type FetchRoleResponse = any;

/**
 * 接口 \/role 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /role`
 */
type FetchRoleRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/role', 'data', string, string, true>>;

/**
 * 接口 \/role 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /role`
 */
const fetchRoleRequestConfig: FetchRoleRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/role',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchRole',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/role 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /role`
 */
export const fetchRole = /*#__PURE__*/ (requestData?: FetchRoleRequest, ...args: UserRequestRestArgs) => {
  return request<FetchRoleResponse>(prepare(fetchRoleRequestConfig, requestData), ...args);
};

fetchRole.requestConfig = fetchRoleRequestConfig;

/**
 * 接口 \/role\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /role/{id}`
 */
export interface FetchRoleIdRequest {
  id: string;
}

/**
 * 接口 \/role\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /role/{id}`
 */
export type FetchRoleIdResponse = string;

/**
 * 接口 \/role\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /role/{id}`
 */
type FetchRoleIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/role/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/role\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /role/{id}`
 */
const fetchRoleIdRequestConfig: FetchRoleIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/role/{id}',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchRoleId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/role\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /role/{id}`
 */
export const fetchRoleId = /*#__PURE__*/ (requestData: FetchRoleIdRequest, ...args: UserRequestRestArgs) => {
  return request<FetchRoleIdResponse>(prepare(fetchRoleIdRequestConfig, requestData), ...args);
};

fetchRoleId.requestConfig = fetchRoleIdRequestConfig;

/**
 * 接口 \/role\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `PATCH /role/{id}`
 */
export interface PatchRoleIdRequest {
  name?: string;
  model?: string;
  instruction?: string;
  id: string;
}

/**
 * 接口 \/role\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `PATCH /role/{id}`
 */
export type PatchRoleIdResponse = any;

/**
 * 接口 \/role\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `PATCH /role/{id}`
 */
type PatchRoleIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/role/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/role\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `PATCH /role/{id}`
 */
const patchRoleIdRequestConfig: PatchRoleIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/role/{id}',
  method: Method.PATCH,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'patchRoleId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/role\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /role/{id}`
 */
export const patchRoleId = /*#__PURE__*/ (requestData: PatchRoleIdRequest, ...args: UserRequestRestArgs) => {
  return request<PatchRoleIdResponse>(prepare(patchRoleIdRequestConfig, requestData), ...args);
};

patchRoleId.requestConfig = patchRoleIdRequestConfig;

/**
 * 接口 \/role\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /role/{id}`
 */
export interface DelRoleIdRequest {
  id: string;
}

/**
 * 接口 \/role\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /role/{id}`
 */
export type DelRoleIdResponse = any;

/**
 * 接口 \/role\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `DELETE /role/{id}`
 */
type DelRoleIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/role/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/role\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `DELETE /role/{id}`
 */
const delRoleIdRequestConfig: DelRoleIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/role/{id}',
  method: Method.DELETE,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'delRoleId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/role\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /role/{id}`
 */
export const delRoleId = /*#__PURE__*/ (requestData: DelRoleIdRequest, ...args: UserRequestRestArgs) => {
  return request<DelRoleIdResponse>(prepare(delRoleIdRequestConfig, requestData), ...args);
};

delRoleId.requestConfig = delRoleIdRequestConfig;

/**
 * 接口 \/balance 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /balance`
 */
export interface CreateBalanceRequest {
  profile?: {};
  model_providers?: {};
  user_info?: {};
}

/**
 * 接口 \/balance 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /balance`
 */
export type CreateBalanceResponse = string;

/**
 * 接口 \/balance 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /balance`
 */
type CreateBalanceRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/balance', 'data', string, string, false>>;

/**
 * 接口 \/balance 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /balance`
 */
const createBalanceRequestConfig: CreateBalanceRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/balance',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createBalance',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/balance 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /balance`
 */
export const createBalance = /*#__PURE__*/ (requestData: CreateBalanceRequest, ...args: UserRequestRestArgs) => {
  return request<CreateBalanceResponse>(prepare(createBalanceRequestConfig, requestData), ...args);
};

createBalance.requestConfig = createBalanceRequestConfig;

/**
 * 接口 \/balance 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /balance`
 */
export interface FetchBalanceRequest {}

/**
 * 接口 \/balance 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /balance`
 */
export type FetchBalanceResponse = string;

/**
 * 接口 \/balance 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /balance`
 */
type FetchBalanceRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/balance', 'data', string, string, true>>;

/**
 * 接口 \/balance 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /balance`
 */
const fetchBalanceRequestConfig: FetchBalanceRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/balance',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchBalance',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/balance 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /balance`
 */
export const fetchBalance = /*#__PURE__*/ (requestData?: FetchBalanceRequest, ...args: UserRequestRestArgs) => {
  return request<FetchBalanceResponse>(prepare(fetchBalanceRequestConfig, requestData), ...args);
};

fetchBalance.requestConfig = fetchBalanceRequestConfig;

/**
 * 接口 \/balance 的 **请求类型**
 *
 * @分类 default
 * @请求头 `PATCH /balance`
 */
export interface PatchBalanceRequest {
  profile?: {};
  model_providers?: {};
  user_info?: {};
}

/**
 * 接口 \/balance 的 **返回类型**
 *
 * @分类 default
 * @请求头 `PATCH /balance`
 */
export type PatchBalanceResponse = any;

/**
 * 接口 \/balance 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `PATCH /balance`
 */
type PatchBalanceRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/balance', 'data', string, string, false>>;

/**
 * 接口 \/balance 的 **请求配置**
 *
 * @分类 default
 * @请求头 `PATCH /balance`
 */
const patchBalanceRequestConfig: PatchBalanceRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/balance',
  method: Method.PATCH,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'patchBalance',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/balance 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /balance`
 */
export const patchBalance = /*#__PURE__*/ (requestData: PatchBalanceRequest, ...args: UserRequestRestArgs) => {
  return request<PatchBalanceResponse>(prepare(patchBalanceRequestConfig, requestData), ...args);
};

patchBalance.requestConfig = patchBalanceRequestConfig;

/**
 * 接口 \/balance\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /balance/{id}`
 */
export interface FetchBalanceIdRequest {
  id: string;
}

/**
 * 接口 \/balance\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /balance/{id}`
 */
export type FetchBalanceIdResponse = string;

/**
 * 接口 \/balance\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /balance/{id}`
 */
type FetchBalanceIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/balance/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/balance\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /balance/{id}`
 */
const fetchBalanceIdRequestConfig: FetchBalanceIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/balance/{id}',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchBalanceId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/balance\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /balance/{id}`
 */
export const fetchBalanceId = /*#__PURE__*/ (requestData: FetchBalanceIdRequest, ...args: UserRequestRestArgs) => {
  return request<FetchBalanceIdResponse>(prepare(fetchBalanceIdRequestConfig, requestData), ...args);
};

fetchBalanceId.requestConfig = fetchBalanceIdRequestConfig;

/**
 * 接口 \/balance\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /balance/{id}`
 */
export interface DelBalanceIdRequest {
  id: string;
}

/**
 * 接口 \/balance\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /balance/{id}`
 */
export type DelBalanceIdResponse = string;

/**
 * 接口 \/balance\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `DELETE /balance/{id}`
 */
type DelBalanceIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/balance/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/balance\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `DELETE /balance/{id}`
 */
const delBalanceIdRequestConfig: DelBalanceIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/balance/{id}',
  method: Method.DELETE,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'delBalanceId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/balance\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /balance/{id}`
 */
export const delBalanceId = /*#__PURE__*/ (requestData: DelBalanceIdRequest, ...args: UserRequestRestArgs) => {
  return request<DelBalanceIdResponse>(prepare(delBalanceIdRequestConfig, requestData), ...args);
};

delBalanceId.requestConfig = delBalanceIdRequestConfig;

/**
 * 接口 \/balance\/user\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /balance/user/{id}`
 */
export interface FetchBalanceUserIdRequest {
  id: string;
}

/**
 * 接口 \/balance\/user\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /balance/user/{id}`
 */
export interface FetchBalanceUserIdResponse {}

/**
 * 接口 \/balance\/user\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /balance/user/{id}`
 */
type FetchBalanceUserIdRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/balance/user/{id}', 'data', 'id', string, false>
>;

/**
 * 接口 \/balance\/user\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /balance/user/{id}`
 */
const fetchBalanceUserIdRequestConfig: FetchBalanceUserIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/balance/user/{id}',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchBalanceUserId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/balance\/user\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /balance/user/{id}`
 */
export const fetchBalanceUserId = /*#__PURE__*/ (requestData: FetchBalanceUserIdRequest, ...args: UserRequestRestArgs) => {
  return request<FetchBalanceUserIdResponse>(prepare(fetchBalanceUserIdRequestConfig, requestData), ...args);
};

fetchBalanceUserId.requestConfig = fetchBalanceUserIdRequestConfig;

/**
 * 接口 \/redemption\/upload 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /redemption/upload`
 */
export interface CreateRedemptionUploadRequest {
  key: string;
  name: string;
  quota: number;
  assigned_user?: number;
}

/**
 * 接口 \/redemption\/upload 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /redemption/upload`
 */
export interface CreateRedemptionUploadResponse {}

/**
 * 接口 \/redemption\/upload 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /redemption/upload`
 */
type CreateRedemptionUploadRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/redemption/upload', 'data', string, string, false>
>;

/**
 * 接口 \/redemption\/upload 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /redemption/upload`
 */
const createRedemptionUploadRequestConfig: CreateRedemptionUploadRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/redemption/upload',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createRedemptionUpload',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/redemption\/upload 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /redemption/upload`
 */
export const createRedemptionUpload = /*#__PURE__*/ (requestData: CreateRedemptionUploadRequest, ...args: UserRequestRestArgs) => {
  return request<CreateRedemptionUploadResponse>(prepare(createRedemptionUploadRequestConfig, requestData), ...args);
};

createRedemptionUpload.requestConfig = createRedemptionUploadRequestConfig;

/**
 * 接口 \/redemption 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /redemption`
 */
export interface FetchRedemptionRequest {
  /**
   * 当前页包含数量
   */
  limit?: string;
  /**
   * 当前页包含数量
   */
  page?: string;
  s?: string;
  status?: string;
  assigned_user?: string;
}

/**
 * 接口 \/redemption 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /redemption`
 */
export type FetchRedemptionResponse = any;

/**
 * 接口 \/redemption 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /redemption`
 */
type FetchRedemptionRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/redemption', 'data', string, 'limit' | 'page' | 's' | 'status' | 'assigned_user', false>
>;

/**
 * 接口 \/redemption 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /redemption`
 */
const fetchRedemptionRequestConfig: FetchRedemptionRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/redemption',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: ['limit', 'page', 's', 'status', 'assigned_user'],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchRedemption',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/redemption 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /redemption`
 */
export const fetchRedemption = /*#__PURE__*/ (requestData: FetchRedemptionRequest, ...args: UserRequestRestArgs) => {
  return request<FetchRedemptionResponse>(prepare(fetchRedemptionRequestConfig, requestData), ...args);
};

fetchRedemption.requestConfig = fetchRedemptionRequestConfig;

/**
 * 接口 \/redemption\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /redemption/{id}`
 */
export interface FetchRedemptionIdRequest {
  id: string;
}

/**
 * 接口 \/redemption\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /redemption/{id}`
 */
export type FetchRedemptionIdResponse = string;

/**
 * 接口 \/redemption\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /redemption/{id}`
 */
type FetchRedemptionIdRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/redemption/{id}', 'data', 'id', string, false>
>;

/**
 * 接口 \/redemption\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /redemption/{id}`
 */
const fetchRedemptionIdRequestConfig: FetchRedemptionIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/redemption/{id}',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchRedemptionId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/redemption\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /redemption/{id}`
 */
export const fetchRedemptionId = /*#__PURE__*/ (requestData: FetchRedemptionIdRequest, ...args: UserRequestRestArgs) => {
  return request<FetchRedemptionIdResponse>(prepare(fetchRedemptionIdRequestConfig, requestData), ...args);
};

fetchRedemptionId.requestConfig = fetchRedemptionIdRequestConfig;

/**
 * 接口 \/redemption\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `PATCH /redemption/{id}`
 */
export interface PatchRedemptionIdRequest {
  key?: string;
  name?: string;
  quota?: number;
  assigned_user?: number;
  id: string;
}

/**
 * 接口 \/redemption\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `PATCH /redemption/{id}`
 */
export type PatchRedemptionIdResponse = any;

/**
 * 接口 \/redemption\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `PATCH /redemption/{id}`
 */
type PatchRedemptionIdRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/redemption/{id}', 'data', 'id', string, false>
>;

/**
 * 接口 \/redemption\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `PATCH /redemption/{id}`
 */
const patchRedemptionIdRequestConfig: PatchRedemptionIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/redemption/{id}',
  method: Method.PATCH,
  requestHeaders: {},
  requestBodyType: RequestBodyType.json,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'patchRedemptionId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/redemption\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /redemption/{id}`
 */
export const patchRedemptionId = /*#__PURE__*/ (requestData: PatchRedemptionIdRequest, ...args: UserRequestRestArgs) => {
  return request<PatchRedemptionIdResponse>(prepare(patchRedemptionIdRequestConfig, requestData), ...args);
};

patchRedemptionId.requestConfig = patchRedemptionIdRequestConfig;

/**
 * 接口 \/redemption\/{id} 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /redemption/{id}`
 */
export interface DelRedemptionIdRequest {
  id: string;
}

/**
 * 接口 \/redemption\/{id} 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /redemption/{id}`
 */
export type DelRedemptionIdResponse = string;

/**
 * 接口 \/redemption\/{id} 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `DELETE /redemption/{id}`
 */
type DelRedemptionIdRequestConfig = Readonly<RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/redemption/{id}', 'data', 'id', string, false>>;

/**
 * 接口 \/redemption\/{id} 的 **请求配置**
 *
 * @分类 default
 * @请求头 `DELETE /redemption/{id}`
 */
const delRedemptionIdRequestConfig: DelRedemptionIdRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/redemption/{id}',
  method: Method.DELETE,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_0,
  paramNames: ['id'],
  queryNames: [],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'delRedemptionId',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
};

/**
 * 接口 \/redemption\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /redemption/{id}`
 */
export const delRedemptionId = /*#__PURE__*/ (requestData: DelRedemptionIdRequest, ...args: UserRequestRestArgs) => {
  return request<DelRedemptionIdResponse>(prepare(delRedemptionIdRequestConfig, requestData), ...args);
};

delRedemptionId.requestConfig = delRedemptionIdRequestConfig;

/* prettier-ignore-end */
