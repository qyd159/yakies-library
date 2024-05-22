import type { RequestConfig, RequestFunctionRestArgs } from 'yapi-to-typescript';
import request from './request';
export type Request<TRequestData, TRequestConfig extends RequestConfig, TRequestResult> = (TRequestConfig['requestDataOptional'] extends true ? (requestData?: TRequestData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult : (requestData: TRequestData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult) & {
    requestConfig: TRequestConfig;
};
/**
 * 接口 \/ 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /`
 */
export interface FetchHelloWorldRequest {
}
/**
 * 接口 \/ 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /`
 */
export type FetchHelloWorldResponse = string;
/**
 * 接口 \/ 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /`
 */
export declare const fetchHelloWorld: {
    (requestData?: FetchHelloWorldRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/", "data", string, string, true>;
};
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
 * 接口 \/ 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /`
 */
export declare const createHelloWorld: {
    (requestData: CreateHelloWorldRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/", "data", string, string, false>;
};
/**
 * 接口 \/test 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /test`
 */
export interface FetchTestRequest {
}
/**
 * 接口 \/test 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /test`
 */
export interface FetchTestResponse {
}
/**
 * 接口 \/test 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /test`
 */
export declare const fetchTest: {
    (requestData?: FetchTestRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/test", "data", string, string, true>;
};
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
 * 接口 \/text2img 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /text2img`
 */
export declare const createText2img: {
    (requestData: CreateText2imgRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/text2img", "data", string, string, false>;
};
/**
 * 接口 \/test\/function_calling 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /test/function_calling`
 */
export interface FetchTestFunctionCallingRequest {
}
/**
 * 接口 \/test\/function_calling 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /test/function_calling`
 */
export type FetchTestFunctionCallingResponse = any;
/**
 * 接口 \/test\/function_calling 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /test/function_calling`
 */
export declare const fetchTestFunctionCalling: {
    (requestData?: FetchTestFunctionCallingRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/test/function_calling", "data", string, string, true>;
};
/**
 * 接口 \/asr 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /asr`
 */
export interface FetchAsrRequest {
}
/**
 * 接口 \/asr 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /asr`
 */
export type FetchAsrResponse = string;
/**
 * 接口 \/asr 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /asr`
 */
export declare const fetchAsr: {
    (requestData?: FetchAsrRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/asr", "data", string, string, true>;
};
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
 * 接口 \/chat 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /chat`
 */
export declare const createChat: {
    (requestData: CreateChatRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/chat", "data", string, string, false>;
};
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
 * 接口 \/chat 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /chat`
 */
export declare const fetchChat: {
    (requestData: FetchChatRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/chat", "data", string, "s" | "limit" | "page" | "user" | "model" | "category" | "dialog_id", false>;
};
/**
 * 接口 \/chat 的 **请求类型**
 *
 * @分类 default
 * @请求头 `DELETE /chat`
 */
export interface DelChatRequest {
}
/**
 * 接口 \/chat 的 **返回类型**
 *
 * @分类 default
 * @请求头 `DELETE /chat`
 */
export interface DelChatResponse {
}
/**
 * 接口 \/chat 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /chat`
 */
export declare const delChat: {
    (requestData?: DelChatRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/chat", "data", string, string, true>;
};
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
 * 接口 \/chat\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /chat/{id}`
 */
export declare const fetchChatId: {
    (requestData: FetchChatIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/chat/{id}", "data", "id", string, false>;
};
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
 * 接口 \/chat\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /chat/{id}`
 */
export declare const patchChatId: {
    (requestData: PatchChatIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/chat/{id}", "data", "id", string, false>;
};
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
 * 接口 \/chat\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /chat/{id}`
 */
export declare const delChatId: {
    (requestData: DelChatIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/chat/{id}", "data", "id", string, false>;
};
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
 * 接口 \/chat\/top\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /chat/top/{id}`
 */
export declare const patchChatTopId: {
    (requestData: PatchChatTopIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/chat/top/{id}", "data", "id", string, false>;
};
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
 * 接口 \/chat\/adjacent 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /chat/adjacent`
 */
export declare const fetchChatAdjacent: {
    (requestData: FetchChatAdjacentRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/chat/adjacent", "data", string, "dialog_id" | "id" | "total", false>;
};
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
 * 接口 \/dialog 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /dialog`
 */
export declare const createDialog: {
    (requestData: CreateDialogRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/dialog", "data", string, string, false>;
};
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
 * 接口 \/dialog 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /dialog`
 */
export declare const fetchDialog: {
    (requestData: FetchDialogRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/dialog", "data", string, "limit" | "page", false>;
};
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
 * 接口 \/dialog\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /dialog/{id}`
 */
export declare const fetchDialogId: {
    (requestData: FetchDialogIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/dialog/{id}", "data", "id", string, false>;
};
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
 * 接口 \/dialog\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /dialog/{id}`
 */
export declare const patchDialogId: {
    (requestData: PatchDialogIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/dialog/{id}", "data", "id", string, false>;
};
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
 * 接口 \/dialog\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /dialog/{id}`
 */
export declare const delDialogId: {
    (requestData: DelDialogIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/dialog/{id}", "data", "id", string, false>;
};
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
 * 接口 \/tag 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /tag`
 */
export declare const createTag: {
    (requestData: CreateTagRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/tag", "data", string, string, false>;
};
/**
 * 接口 \/tag 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /tag`
 */
export interface FetchTagRequest {
}
/**
 * 接口 \/tag 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /tag`
 */
export type FetchTagResponse = string;
/**
 * 接口 \/tag 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /tag`
 */
export declare const fetchTag: {
    (requestData?: FetchTagRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/tag", "data", string, string, true>;
};
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
 * 接口 \/tag\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /tag/{id}`
 */
export declare const fetchTagId: {
    (requestData: FetchTagIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/tag/{id}", "data", "id", string, false>;
};
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
 * 接口 \/tag\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /tag/{id}`
 */
export declare const patchTagId: {
    (requestData: PatchTagIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/tag/{id}", "data", "id", string, false>;
};
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
 * 接口 \/tag\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /tag/{id}`
 */
export declare const delTagId: {
    (requestData: DelTagIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/tag/{id}", "data", "id", string, false>;
};
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
 * 接口 \/category 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /category`
 */
export declare const createCategory: {
    (requestData: CreateCategoryRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/category", "data", string, string, false>;
};
/**
 * 接口 \/category 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /category`
 */
export interface FetchCategoryRequest {
}
/**
 * 接口 \/category 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /category`
 */
export type FetchCategoryResponse = any;
/**
 * 接口 \/category 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /category`
 */
export declare const fetchCategory: {
    (requestData?: FetchCategoryRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/category", "data", string, string, true>;
};
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
export interface FetchCategoryIdResponse {
}
/**
 * 接口 \/category\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /category/{id}`
 */
export declare const fetchCategoryId: {
    (requestData: FetchCategoryIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/category/{id}", "data", "id", string, false>;
};
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
 * 接口 \/category\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /category/{id}`
 */
export declare const patchCategoryId: {
    (requestData: PatchCategoryIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/category/{id}", "data", "id", string, false>;
};
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
 * 接口 \/category\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /category/{id}`
 */
export declare const delCategoryId: {
    (requestData: DelCategoryIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/category/{id}", "data", "id", string, false>;
};
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
 * 接口 \/category\/reorder 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /category/reorder`
 */
export declare const createCategoryReorder: {
    (requestData: CreateCategoryReorderRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/category/reorder", "data", string, string, false>;
};
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
 * 接口 \/category\/bind 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /category/bind`
 */
export declare const createCategoryBind: {
    (requestData: CreateCategoryBindRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/category/bind", "data", string, string, false>;
};
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
 * 接口 \/picture 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /picture`
 */
export declare const createPicture: {
    (requestData: CreatePictureRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/picture", "data", string, string, false>;
};
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
 * 接口 \/picture 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /picture`
 */
export declare const fetchPicture: {
    (requestData: FetchPictureRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/picture", "data", string, "s" | "limit" | "page" | "user" | "model" | "category" | "dialog_id", false>;
};
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
 * 接口 \/picture\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /picture/{id}`
 */
export declare const fetchPictureId: {
    (requestData: FetchPictureIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/picture/{id}", "data", "id", string, false>;
};
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
 * 接口 \/picture\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /picture/{id}`
 */
export declare const patchPictureId: {
    (requestData: PatchPictureIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/picture/{id}", "data", "id", string, false>;
};
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
 * 接口 \/picture\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /picture/{id}`
 */
export declare const delPictureId: {
    (requestData: DelPictureIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/picture/{id}", "data", "id", string, false>;
};
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
 * 接口 \/role 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /role`
 */
export declare const createRole: {
    (requestData: CreateRoleRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/role", "data", string, string, false>;
};
/**
 * 接口 \/role 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /role`
 */
export interface FetchRoleRequest {
}
/**
 * 接口 \/role 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /role`
 */
export type FetchRoleResponse = any;
/**
 * 接口 \/role 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /role`
 */
export declare const fetchRole: {
    (requestData?: FetchRoleRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/role", "data", string, string, true>;
};
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
 * 接口 \/role\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /role/{id}`
 */
export declare const fetchRoleId: {
    (requestData: FetchRoleIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/role/{id}", "data", "id", string, false>;
};
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
 * 接口 \/role\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /role/{id}`
 */
export declare const patchRoleId: {
    (requestData: PatchRoleIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/role/{id}", "data", "id", string, false>;
};
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
 * 接口 \/role\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /role/{id}`
 */
export declare const delRoleId: {
    (requestData: DelRoleIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/role/{id}", "data", "id", string, false>;
};
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
 * 接口 \/balance 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /balance`
 */
export declare const createBalance: {
    (requestData: CreateBalanceRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/balance", "data", string, string, false>;
};
/**
 * 接口 \/balance 的 **请求类型**
 *
 * @分类 default
 * @请求头 `GET /balance`
 */
export interface FetchBalanceRequest {
}
/**
 * 接口 \/balance 的 **返回类型**
 *
 * @分类 default
 * @请求头 `GET /balance`
 */
export type FetchBalanceResponse = string;
/**
 * 接口 \/balance 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /balance`
 */
export declare const fetchBalance: {
    (requestData?: FetchBalanceRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/balance", "data", string, string, true>;
};
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
 * 接口 \/balance 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /balance`
 */
export declare const patchBalance: {
    (requestData: PatchBalanceRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/balance", "data", string, string, false>;
};
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
 * 接口 \/balance\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /balance/{id}`
 */
export declare const fetchBalanceId: {
    (requestData: FetchBalanceIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/balance/{id}", "data", "id", string, false>;
};
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
 * 接口 \/balance\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /balance/{id}`
 */
export declare const delBalanceId: {
    (requestData: DelBalanceIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/balance/{id}", "data", "id", string, false>;
};
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
export interface FetchBalanceUserIdResponse {
}
/**
 * 接口 \/balance\/user\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /balance/user/{id}`
 */
export declare const fetchBalanceUserId: {
    (requestData: FetchBalanceUserIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/balance/user/{id}", "data", "id", string, false>;
};
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
export interface CreateRedemptionUploadResponse {
}
/**
 * 接口 \/redemption\/upload 的 **请求函数**
 *
 * @分类 default
 * @请求头 `POST /redemption/upload`
 */
export declare const createRedemptionUpload: {
    (requestData: CreateRedemptionUploadRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/redemption/upload", "data", string, string, false>;
};
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
 * 接口 \/redemption 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /redemption`
 */
export declare const fetchRedemption: {
    (requestData: FetchRedemptionRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/redemption", "data", string, "s" | "limit" | "page" | "status" | "assigned_user", false>;
};
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
 * 接口 \/redemption\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `GET /redemption/{id}`
 */
export declare const fetchRedemptionId: {
    (requestData: FetchRedemptionIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/redemption/{id}", "data", "id", string, false>;
};
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
 * 接口 \/redemption\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `PATCH /redemption/{id}`
 */
export declare const patchRedemptionId: {
    (requestData: PatchRedemptionIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/redemption/{id}", "data", "id", string, false>;
};
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
 * 接口 \/redemption\/{id} 的 **请求函数**
 *
 * @分类 default
 * @请求头 `DELETE /redemption/{id}`
 */
export declare const delRedemptionId: {
    (requestData: DelRedemptionIdRequest, ...args: RequestFunctionRestArgs<any>): any;
    requestConfig: RequestConfig<"http://127.0.0.1:50505/mock/0", "", "", "/redemption/{id}", "data", "id", string, false>;
};
