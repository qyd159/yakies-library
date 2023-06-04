/** 通过yapi-to-typescript自动生成请求代码 */
import { Generator } from 'yapi-to-typescript/lib/cjs/Generator'
import ora from 'ora'
import { ConfigWithHooks, ServerConfig } from 'yapi-to-typescript'
import { dedent, wait } from 'vtils'
import loadConfig from '../lib/loadConfig';
import { complicatedHandlers } from '../lib/ytt';
import consola from 'consola'
import path from 'path';
import requestTplText from '../lib/ytt/request.tpl';
import { existsSync, fstat, writeFileSync, ensureDir } from 'fs-extra';


export default async function (args) {
    let config: ConfigWithHooks | undefined
    let generator: Generator | undefined
    let spinner: ora.Ora | undefined
    try {
        const userConfig = (await loadConfig(args)).ytt;
        config = userConfig.map(item => {
            const { serverUrl, serverType, outputDir, projects } = item
            const requestFunctionFilePath = path.join(outputDir, 'request.ts');
            if (!existsSync(requestFunctionFilePath)) {
                ensureDir(path.dirname(requestFunctionFilePath))
                writeFileSync(requestFunctionFilePath, requestTplText)
            }
            return {
                serverUrl,
                serverType,
                typesOnly: false,
                target: 'typescript',
                reactHooks: {
                    enabled: false,
                },
                prodEnvName: 'production',
                outputFilePath: path.join(outputDir, 'index.ts'),
                requestFunctionFilePath,
                dataKey: 'data',
                projects: projects.map(project => {
                    return {
                        token: project.token,
                        categories: project.categories.map(category => {
                            return {
                                id: category.id,
                                ...complicatedHandlers(category.prefix, category.prefixReserve ? null : category.prefix)
                            }
                        })
                    }
                })
            }
        })

        generator = new Generator(config!, { cwd: process.cwd() })
        spinner = ora('正在获取数据并生成代码...').start()
        const delayNotice = wait(5000)
        delayNotice.then(() => {
            spinner!.text = `正在获取数据并生成代码... (若长时间处于此状态，请检查是否有接口定义的数据过大导致拉取或解析缓慢)`
        })
        await generator.prepare()
        delayNotice.cancel()

        const output = await generator.generate()
        spinner.stop()
        consola.success('获取数据并生成代码完毕')

        await generator.write(output)
        consola.success('写入文件完毕')
        await generator.destroy()
        await config!.hooks?.success?.()
    } catch (err) {
        spinner?.stop()
        await generator?.destroy()
        await config?.hooks?.fail?.()
        /* istanbul ignore next */
        consola.error(err)
    }
    await config?.hooks?.complete?.()
}
