import { merge } from 'lodash';
import DefaultConfig from './config.default';
/**
 * 根据环境变量判断使用配置
 */
export default (isDev) => {
    let envConfig = {};
    try {
        envConfig = isDev ? require(`./config.development`).default : {};
    }
    catch (e) {
        // 无效配置则自动忽略
    }
    // 合并配置
    return merge(DefaultConfig, envConfig);
};