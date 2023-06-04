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
import request from './request'

type UserRequestRestArgs = RequestFunctionRestArgs<typeof request>

// Request: 目前 React Hooks 功能有用到
export type Request<
  TRequestData,
  TRequestConfig extends RequestConfig,
  TRequestResult,
> = (TRequestConfig['requestDataOptional'] extends true
  ? (requestData?: TRequestData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult
  : (requestData: TRequestData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult) & {
  requestConfig: TRequestConfig
}

const mockUrl_0_0_0_0 = 'http://127.0.0.1:50505/mock/0' as any
const devUrl_0_0_0_0 = '' as any
const prodUrl_0_0_0_0 = '' as any
const dataKey_0_0_0_0 = 'data' as any

/**
 * 接口 用户登录 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /admin/login`
 */
export interface CreateAdminLoginRequest {
  /**
   * 用户名
   */
  username: string
  /**
   * 密码
   */
  password: string
  /**
   * 验证码标识
   */
  captchaId: string
  /**
   * 用户输入的验证码
   */
  verifyCode: string
}

/**
 * 接口 用户登录 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /admin/login`
 */
export interface CreateAdminLoginResponse {
  /**
   * JWT身份Token
   */
  token: string
}

/**
 * 接口 用户登录 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /admin/login`
 */
type CreateAdminLoginRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/admin/login', 'data', string, string, false>
>

/**
 * 接口 用户登录 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /admin/login`
 */
const createAdminLoginRequestConfig: CreateAdminLoginRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/admin/login',
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
  requestFunctionName: 'createAdminLogin',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
}

/**
 * 接口 用户登录 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /admin/login`
 */
export const createAdminLogin = /*#__PURE__*/ (requestData: CreateAdminLoginRequest, ...args: UserRequestRestArgs) => {
  return request<CreateAdminLoginResponse>(prepare(createAdminLoginRequestConfig, requestData), ...args)
}

createAdminLogin.requestConfig = createAdminLoginRequestConfig

/**
 * 接口 手机登录 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone`
 */
export interface CreatePhoneRequest {
  /**
   * 手机号
   */
  phone: string
  /**
   * 验证码标识
   */
  verifyId: string
  /**
   * 用户输入的验证码
   */
  verifyCode: string
}

/**
 * 接口 手机登录 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone`
 */
export interface CreatePhoneResponse {
  /**
   * JWT身份Token
   */
  token: string
}

/**
 * 接口 手机登录 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone`
 */
type CreatePhoneRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/admin/login/phone', 'data', string, string, false>
>

/**
 * 接口 手机登录 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone`
 */
const createPhoneRequestConfig: CreatePhoneRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/admin/login/phone',
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
  requestFunctionName: 'createPhone',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
}

/**
 * 接口 手机登录 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone`
 */
export const createPhone = /*#__PURE__*/ (requestData: CreatePhoneRequest, ...args: UserRequestRestArgs) => {
  return request<CreatePhoneResponse>(prepare(createPhoneRequestConfig, requestData), ...args)
}

createPhone.requestConfig = createPhoneRequestConfig

/**
 * 接口 发送手机登录验证码 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone/sms`
 */
export interface CreatePhoneSmsRequest {
  /**
   * 手机号
   */
  phone: string
  /**
   * 验证码标识
   */
  verifyId: string
  /**
   * 用户输入的验证码
   */
  verifyCode: string
}

/**
 * 接口 发送手机登录验证码 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone/sms`
 */
export interface CreatePhoneSmsResponse {
  /**
   * JWT身份Token
   */
  token: string
}

/**
 * 接口 发送手机登录验证码 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone/sms`
 */
type CreatePhoneSmsRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/admin/login/phone/sms', 'data', string, string, false>
>

/**
 * 接口 发送手机登录验证码 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone/sms`
 */
const createPhoneSmsRequestConfig: CreatePhoneSmsRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/admin/login/phone/sms',
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
  requestFunctionName: 'createPhoneSms',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
}

/**
 * 接口 发送手机登录验证码 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /admin/login/phone/sms`
 */
export const createPhoneSms = /*#__PURE__*/ (requestData: CreatePhoneSmsRequest, ...args: UserRequestRestArgs) => {
  return request<CreatePhoneSmsResponse>(prepare(createPhoneSmsRequestConfig, requestData), ...args)
}

createPhoneSms.requestConfig = createPhoneSmsRequestConfig

/**
 * 接口 发送短信需要的验证码 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /admin/register/sms/captcha/img`
 */
export interface FetchSmsCaptchaImgRequest {
  /**
   * 验证码宽度
   */
  width?: string
  /**
   * 验证码宽度
   */
  height?: string
}

/**
 * 接口 发送短信需要的验证码 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /admin/register/sms/captcha/img`
 */
export type FetchSmsCaptchaImgResponse = any

/**
 * 接口 发送短信需要的验证码 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /admin/register/sms/captcha/img`
 */
type FetchSmsCaptchaImgRequestConfig = Readonly<
  RequestConfig<
    'http://127.0.0.1:50505/mock/0',
    '',
    '',
    '/admin/register/sms/captcha/img',
    'data',
    string,
    'width' | 'height',
    false
  >
>

/**
 * 接口 发送短信需要的验证码 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /admin/register/sms/captcha/img`
 */
const fetchSmsCaptchaImgRequestConfig: FetchSmsCaptchaImgRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/admin/register/sms/captcha/img',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: ['width', 'height'],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchSmsCaptchaImg',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
}

/**
 * 接口 发送短信需要的验证码 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /admin/register/sms/captcha/img`
 */
export const fetchSmsCaptchaImg = /*#__PURE__*/ (
  requestData: FetchSmsCaptchaImgRequest,
  ...args: UserRequestRestArgs
) => {
  return request<FetchSmsCaptchaImgResponse>(prepare(fetchSmsCaptchaImgRequestConfig, requestData), ...args)
}

fetchSmsCaptchaImg.requestConfig = fetchSmsCaptchaImgRequestConfig

/**
 * 接口 注册时的短信验证 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/register`
 */
export interface CreateSmsRegisterRequest {
  /**
   * 手机号码
   */
  phone: string
  /**
   * 验证码id
   */
  captchaId: string
  /**
   * 验证码code
   */
  captchaCode: string
}

/**
 * 接口 注册时的短信验证 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/register`
 */
export type CreateSmsRegisterResponse = any

/**
 * 接口 注册时的短信验证 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/register`
 */
type CreateSmsRegisterRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/admin/register/sms/register', 'data', string, string, false>
>

/**
 * 接口 注册时的短信验证 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/register`
 */
const createSmsRegisterRequestConfig: CreateSmsRegisterRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/admin/register/sms/register',
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
  requestFunctionName: 'createSmsRegister',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
}

/**
 * 接口 注册时的短信验证 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/register`
 */
export const createSmsRegister = /*#__PURE__*/ (
  requestData: CreateSmsRegisterRequest,
  ...args: UserRequestRestArgs
) => {
  return request<CreateSmsRegisterResponse>(prepare(createSmsRegisterRequestConfig, requestData), ...args)
}

createSmsRegister.requestConfig = createSmsRegisterRequestConfig

/**
 * 接口 注册时的短信下发状态通知 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/callback`
 */
export interface CreateSmsCallbackRequest {}

/**
 * 接口 注册时的短信下发状态通知 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/callback`
 */
export type CreateSmsCallbackResponse = any

/**
 * 接口 注册时的短信下发状态通知 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/callback`
 */
type CreateSmsCallbackRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/admin/register/sms/callback', 'data', string, string, true>
>

/**
 * 接口 注册时的短信下发状态通知 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/callback`
 */
const createSmsCallbackRequestConfig: CreateSmsCallbackRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/admin/register/sms/callback',
  method: Method.POST,
  requestHeaders: {},
  requestBodyType: RequestBodyType.raw,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: [],
  requestDataOptional: true,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'createSmsCallback',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
}

/**
 * 接口 注册时的短信下发状态通知 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /admin/register/sms/callback`
 */
export const createSmsCallback = /*#__PURE__*/ (
  requestData?: CreateSmsCallbackRequest,
  ...args: UserRequestRestArgs
) => {
  return request<CreateSmsCallbackResponse>(prepare(createSmsCallbackRequestConfig, requestData), ...args)
}

createSmsCallback.requestConfig = createSmsCallbackRequestConfig

/**
 * 接口 注册接口 的 **请求类型**
 *
 * @分类 default
 * @请求头 `POST /admin/register/register`
 */
export interface CreateRegisterRequest {
  /**
   * 用户名
   */
  username: string
  /**
   * 密码
   */
  password: string
  /**
   * 手机号码
   */
  phone: string
  /**
   * 手机验证码
   */
  verifyCode: string
  /**
   * 手机验证码唯一标识
   */
  verifyId: string
}

/**
 * 接口 注册接口 的 **返回类型**
 *
 * @分类 default
 * @请求头 `POST /admin/register/register`
 */
export type CreateRegisterResponse = any

/**
 * 接口 注册接口 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `POST /admin/register/register`
 */
type CreateRegisterRequestConfig = Readonly<
  RequestConfig<'http://127.0.0.1:50505/mock/0', '', '', '/admin/register/register', 'data', string, string, false>
>

/**
 * 接口 注册接口 的 **请求配置**
 *
 * @分类 default
 * @请求头 `POST /admin/register/register`
 */
const createRegisterRequestConfig: CreateRegisterRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/admin/register/register',
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
  requestFunctionName: 'createRegister',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
}

/**
 * 接口 注册接口 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /admin/register/register`
 */
export const createRegister = /*#__PURE__*/ (requestData: CreateRegisterRequest, ...args: UserRequestRestArgs) => {
  return request<CreateRegisterResponse>(prepare(createRegisterRequestConfig, requestData), ...args)
}

createRegister.requestConfig = createRegisterRequestConfig

/**
 * 接口 验证用户名或手机号 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /admin/register/checkUser`
 */
export interface FetchCheckUserRequest {
  /**
   * 用户名
   */
  username?: string
  /**
   * 手机号
   */
  phone?: string
}

/**
 * 接口 验证用户名或手机号 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /admin/register/checkUser`
 */
export type FetchCheckUserResponse = any

/**
 * 接口 验证用户名或手机号 的 **请求配置的类型**
 *
 * @分类 default
 * @请求头 `GET /admin/register/checkUser`
 */
type FetchCheckUserRequestConfig = Readonly<
  RequestConfig<
    'http://127.0.0.1:50505/mock/0',
    '',
    '',
    '/admin/register/checkUser',
    'data',
    string,
    'username' | 'phone',
    false
  >
>

/**
 * 接口 验证用户名或手机号 的 **请求配置**
 *
 * @分类 default
 * @请求头 `GET /admin/register/checkUser`
 */
const fetchCheckUserRequestConfig: FetchCheckUserRequestConfig = /*#__PURE__*/ {
  mockUrl: mockUrl_0_0_0_0,
  devUrl: devUrl_0_0_0_0,
  prodUrl: prodUrl_0_0_0_0,
  path: '/admin/register/checkUser',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.raw,
  dataKey: dataKey_0_0_0_0,
  paramNames: [],
  queryNames: ['username', 'phone'],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'fetchCheckUser',
  queryStringArrayFormat: QueryStringArrayFormat.brackets,
  extraInfo: {},
}

/**
 * 接口 验证用户名或手机号 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /admin/register/checkUser`
 */
export const fetchCheckUser = /*#__PURE__*/ (requestData: FetchCheckUserRequest, ...args: UserRequestRestArgs) => {
  return request<FetchCheckUserResponse>(prepare(fetchCheckUserRequestConfig, requestData), ...args)
}

fetchCheckUser.requestConfig = fetchCheckUserRequestConfig

/* prettier-ignore-end */
