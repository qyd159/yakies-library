import type { ModelType } from './shared';
export declare function useChatSocket({ records, responseLoading, responsingText, autoScrollEnabled, scrollToBottom, voiceTextPopoverVisible, content, responsing, setContent, model, role, imgSize, chatStore, userStore, backToLogin, message }: {
    records: any;
    responseLoading: any;
    responsingText: any;
    autoScrollEnabled: any;
    scrollToBottom: any;
    voiceTextPopoverVisible: any;
    content: any;
    responsing: any;
    setContent: any;
    model: any;
    role: any;
    imgSize: any;
    chatStore: any;
    userStore: any;
    backToLogin: any;
    message: any;
}): {
    init: () => Promise<void>;
    chatgpt_id: import("vue").Ref<any>;
    dialog_id: import("vue").Ref<any>;
    createAIRequest: (ctext: any, request_id?: any, count?: number) => Promise<void>;
    sendMsg: (msg?: any) => Promise<any>;
    stopGeneration: () => void;
    retrieveModels: () => Promise<void>;
    organizedModels: import("vue").ComputedRef<{
        label: string;
        value: string;
        type: ModelType;
        filter?: ((model: string) => boolean) | undefined;
        company?: string | undefined;
        getName?: ((model: string) => string) | undefined;
        selectable?: boolean | undefined;
        children?: any[] | undefined;
    }[]>;
    socketInst: import("vue").Ref<any>;
};
