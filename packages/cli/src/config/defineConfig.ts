/**
 * 用于智能提示
 */
export function defineConfig(config: IConfig): IConfig {
  return config;
}

/**
 * yarc 配置
 */
export interface IConfig {
  browserSyncPort?: number;
  dev_ip?: string;
  port_range?: { port: number; stopPort?: number };
  port?: number;
  proxyCacheDir?: string;
  // http代理
  httpProxy?: Proxy[];
  // socket代理
  socketProxy?: {};
  ytt?: { serverUrl: string; serverType: 'swagger' | 'yapi'; outputDir: string; overwriteRequestFile?: boolean; projects: Project[] }[];
}

//--------- config interface ------------

export interface Project {
  token: string;
  categories: { id: string | number; prefix: string | RegExp; prefixReserve?: boolean }[];
}

export interface Proxy {
  target: string;
  baseApi: string;
  cache?: boolean;
  path?: string;
  prepareUrl?: string;
  url?: string;
  gziped?: boolean;
  jsRequires: string[];
  cssRequires: string[];
  jsInjector: { url: string; target: string }[];
  name?: string;
  capture?: boolean;
  description?: string;
}

export interface GlobalConfig extends IConfig {
  apiProxy?: any;
  pureProxy?: any;
}
