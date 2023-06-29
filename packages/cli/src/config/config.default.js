import { defineConfig } from './defineConfig';
/**
 * 项目通用默认配置，但优先级最低
 */
export default defineConfig({
    browserSyncPort: 3000,
    dev_ip: "127.0.0.1",
    port_range: {
        port: 9090,
        stopPort: 9094,
    },
    proxyCacheDir: ''
});
