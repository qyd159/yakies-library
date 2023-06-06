import fs from 'fs-extra'
import path from 'path'
import consola from 'consola'
import loadBaseConfig from '../config/configuration';
import { IConfig } from '../config/defineConfig';
import { merge } from 'vtils';

export default async function (isDev: boolean = false): Promise<[IConfig, string]> {
  let cwd!: string
  let configTSFile!: string
  let configJSFile!: string
  let configFile!: string

  cwd = process.cwd()
  configTSFile = path.join(cwd, '.yarc.ts')
  configJSFile = path.join(cwd, '.yarc.js')
  const configTSFileExist = await fs.pathExists(configTSFile)
  configFile = configTSFileExist ? configTSFile : configJSFile

  const configFileExists = fs.existsSync(configFile);

  if (!configFileExists) {
    throw Error(
      `找不到配置文件:${configFile}
            }`,
    )
  }
  consola.success(`找到配置文件: ${configFile}`)

  const baseConfig = loadBaseConfig(isDev)

  const config: IConfig = merge(baseConfig, require(configFile));

  return [config, configFile]
}
