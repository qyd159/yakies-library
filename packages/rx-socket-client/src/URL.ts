export default class SimpleURL {
    protocol: any;
    hostname: any;
    port: any;
    pathname: any;
    search: any;
    hash: any;
    constructor(url) {
      this._parseUrl(url);
    }
  
    _parseUrl(url) {
      const pattern = /^(?:(\w+):\/\/)?([^\/:]+)(?::(\d+))?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/;
      const matches = url.match(pattern) || [];
  
      this.protocol = matches[1] || '';
      this.hostname = matches[2] || '';
      this.port = matches[3] || '';
      this.pathname = matches[4] || '/';
      this.search = matches[5] || '';
      this.hash = matches[6] || '';
    }
  
    get href() {
      const portPart = this.port ? `:${this.port}` : '';
      const protocolPart = this.protocol ? `${this.protocol}://` : '';
      
      return `${protocolPart}${this.hostname}${portPart}${this.pathname}${this.search}${this.hash}`;
    }
  
    set href(url) {
      this._parseUrl(url);
    }
  
    toString() {
      return this.href;
    }
  
    setSearchParams(key, value) {
      const searchParams = this._parseSearchParams(this.search);
      searchParams[key] = value;
      this.search = '?' + Object.entries(searchParams).map(([k, v]:any) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    }
  
    _parseSearchParams(search) {
      if (!search) return {};
  
      return search.substring(1).split('&').reduce((params, pair) => {
        const [key, value] = pair.split('=').map(decodeURIComponent);
        params[key] = value;
        return params;
      }, {});
    }
  }