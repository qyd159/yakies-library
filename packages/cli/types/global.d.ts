declare module '*.tpl' {
  const content: string;
  export default content;
}

declare module 'node-request-interceptor*';

declare module NodeJS {
  import { GlobalConfig } from 'src/config/defineConfig';
  interface Global {
    YaConfig: GlobalConfig;
  }
}
