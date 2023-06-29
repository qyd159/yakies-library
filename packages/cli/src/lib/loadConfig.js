import fs from 'fs-extra';
import path from 'path';
import consola from 'consola';
import loadBaseConfig from '../config/configuration';
import { merge } from 'vtils';
import ts2cjs from './ts2common';
export default async function (isDev = false) {
    let cwd;
    let configTSFile;
    let configJSFile;
    let configFile;
    cwd = process.cwd();
    configTSFile = path.join(cwd, '.yarc.ts');
    configJSFile = path.join(cwd, '.yarc.js');
    const configTSFileExist = await fs.pathExists(configTSFile);
    configFile = configTSFileExist ? configTSFile : configJSFile;
    const configFileExists = fs.existsSync(configFile);
    if (!configFileExists) {
        console.error(`没找到配置文件:${configFile}
            }`);
        return [{}, null];
    }
    consola.success(`找到配置文件: ${configFile}`);
    const baseConfig = loadBaseConfig(isDev);
    const config = merge(baseConfig, ts2cjs(configFile));
    return [config, configFile];
}
