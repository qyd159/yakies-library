export default class SimpleURL {
    _url: any;
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    host: string;
    constructor(url) {
        this._url = url;
        this._parseUrl();
    }

    _parseUrl() {
        const parser = document.createElement('a');
        parser.href = this._url;
        
        this.protocol = parser.protocol;
        this.hostname = parser.hostname;
        this.port = parser.port;
        this.pathname = parser.pathname.startsWith('/') ? parser.pathname : '/' + parser.pathname;
        this.search = parser.search;
        this.hash = parser.hash;
        this.host = this.hostname + (this.port ? ':' + this.port : '');
    }

    get href() {
        return `${this.protocol}//${this.host}${this.pathname}${this.search}${this.hash}`;
    }

    set href(value) {
        this._url = value;
        this._parseUrl();
    }

    toString() {
        return this.href;
    }

    // 示例：简化版的searchParams设置
    setSearchParams(key, value) {
        const searchParams = new URLSearchParams(this.search);
        searchParams.set(key, value);
        this.search = '?' + searchParams.toString(); // 确保search以?开头
    }
}
