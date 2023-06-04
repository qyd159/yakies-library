import fs from 'fs-extra'
import path from 'path'
import consola from 'consola'

export default async function (args) {
    let useCustomConfigFile = false
    let cwd!: string
    let configTSFile!: string
    let configJSFile!: string
    let configFile!: string
    let configFileExist!: boolean

    if (!args.f) {
        cwd = process.cwd()
        configTSFile = path.join(cwd, '.yarc.ts')
        configJSFile = path.join(cwd, '.yarc.js')
        const configTSFileExist = await fs.pathExists(configTSFile)
        const configJSFileExist =
            !configTSFileExist && (await fs.pathExists(configJSFile))
        configFileExist = configTSFileExist || configJSFileExist
        configFile = configTSFileExist ? configTSFile : configJSFile

        const configFileExists = fs.existsSync(configFile);

        if (!configFileExists) {
            throw Error(
                `找不到配置文件:${configFile}
            }`,
            )
        }
        consola.success(`找到配置文件: ${configFile}`)

        return require(configFile)
    }
}