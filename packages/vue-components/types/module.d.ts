/*
 * @Author: qinyadong
 * @Date: 2022-06-21 18:20:54
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-06-21 18:20:55
 * @FilePath: \aea-client\packages\vue-components\types\module.d.ts
 */
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

declare module 'ant-design-vue/es/locale/*' {
  import { Locale } from 'ant-design-vue/types/locale-provider';
  const locale: Locale & ReadonlyRecordable;
  export default locale as Locale & ReadonlyRecordable;
}

declare module 'moment/dist/locale/*' {
  import { LocaleSpecification } from 'moment';
  const locale: LocaleSpecification & ReadonlyRecordable;
  export default locale;
}

declare module 'virtual:*' {
  const result: any;
  export default result;
}

declare module 'hotkeys-js' {
  import hotkeys from 'hotkeys-js';
  export default hotkeys;
}
