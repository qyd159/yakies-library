import type { IConfig } from '@yakies/cli';

const modules = [
  {
    name: 'chatgpt',
    serverUrl: 'https://chatgpt.yakies.cn/api-json',
    prefix: '',
  },
];
export default {
  ytt: modules.map(({ serverUrl, name, prefix }) => {
    return {
      serverUrl,
      serverType: 'swagger',
      outputDir: `src/api/generated/${name}`,
      overwriteRequestFile: false,
      projects: [
        {
          token: '',
          categories: [
            {
              id: 0,
              prefix,
              prefixReserve: false,
            },
          ],
        },
      ],
    };
  }),
} as IConfig;
