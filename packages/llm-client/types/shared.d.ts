export declare const botName = "\u77E5\u8BC6\u5C0F\u840C\u5B9D";
export declare const defaultRole: {
    id: number;
    name: string;
    instruction: string;
};
export type ModelType = 'dialog' | 'img' | 'vision' | 'tts' | 'asr' | 'nlu' | 'nlg' | 'kg' | 'qa' | 'emotion' | 'sentiment' | 'ocr' | 'face' | 'pose' | 'gesture' | 'action' | 'video' | 'audio' | 'image' | 'text' | 'file' | 'other';
export interface ModelItem {
    label: string;
    value: string;
    type: ModelType;
    filter?: (model: string) => boolean;
    company?: string;
    getName?: (model: string) => string;
    selectable?: boolean;
    children?: ModelItem[];
}
export declare const modelCategories: {
    label: string;
    value: string;
    type: ModelType;
    filter?: ((model: string) => boolean) | undefined;
    company?: string | undefined;
    getName?: ((model: string) => string) | undefined;
    selectable?: boolean | undefined;
    children?: any[] | undefined;
}[];
export declare const imgSizes: {
    label: string;
    value: string;
}[];
export declare function isImgModel(model: any): boolean;
export declare function getModelInfo(model: any): {
    catInfo: {
        label: string;
        value: string;
        type: ModelType;
        filter?: ((model: string) => boolean) | undefined;
        company?: string | undefined;
        getName?: ((model: string) => string) | undefined;
        selectable?: boolean | undefined;
        children?: any[] | undefined;
    } | undefined;
    modelInfo: {
        label: string;
        value: string;
        type: ModelType;
        filter?: ((model: string) => boolean) | undefined;
        company?: string | undefined;
        getName?: ((model: string) => string) | undefined;
        selectable?: boolean | undefined;
        children?: any[] | undefined;
    } | undefined;
};
