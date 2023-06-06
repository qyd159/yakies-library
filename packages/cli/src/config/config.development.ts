import { defineConfig } from './defineConfig'

export default defineConfig({
  proxys: [{
    target: 'https://localhost:3344/',
    baseApi: '/v1',
  }],
  ytt: [
    {
      serverUrl: 'https://user-center.yakies.cn/api-json',
      serverType: 'swagger',
      outputDir: 'src/fantasy/common/api/generated/netdisk',
      overwriteRequestFile: false,
      projects: [
        {
          token: '',
          categories: [
            {
              id: 0,
              prefix: /^\/admin\/netdisk/,
              prefixReserve: false,
            },
          ],
        },
      ],
    },
  ],
});
