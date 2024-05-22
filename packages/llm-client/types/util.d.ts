export declare const md: any;
export declare function getQueryStringByName(name: any): string;
export declare const formatDate: {
    format(date: any, pattern: any): any;
    parse(dateString: any, pattern: any): Date | null;
};
export declare const receivedCallbacks: {};
export declare function promisifyIpc(request_id: any, sendData: any, emit: any, callback?: any): Promise<any>;
export declare function observeElementDimension(target: any, cb: any): void;
export declare function processMarkdown(markdownText: any): any;
