import { Pinia, StoreDefinition } from 'pinia'

type Console = typeof console.log;

type ConsoleObj = {
  [key in keyof typeof console]: typeof console[key];
};

type ConsoleLike = Console & Partial<ConsoleObj>;
type RequestReturnedPromise = (data: any) => Promise<[err: any, err: any]>

type ApplicationDeps = {
  createScopeLog: (type: string) => ConsoleLike
  store: Pinia
  useUserStore: StoreDefinition
  useNetworkStore: StoreDefinition
}

// 主应用依赖项
export let applicationDeps: Partial<ApplicationDeps> = {
  createScopeLog: () => {
    const log = console.log;
    ['log', 'error', 'warn', 'info'].forEach(item => {
      log[item] = console[item]
    })
    return log
  },
}

export function setDeps(deps: ApplicationDeps) {
  Object.assign(applicationDeps, deps)
}
