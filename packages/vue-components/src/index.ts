import { App } from 'vue';
import * as components from './components';

function install(app: App) {
  for (const key in components) {
    app.component(key, components[key]);
  }
}

export default { install };

export * from './components';
export * from './constants';
export * from './utils';
export * from './preload';
export * from './hooks';
