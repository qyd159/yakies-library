import {defineConfig} from 'vitepress';
import purgeIcons from 'vite-plugin-purge-icons';
import path from 'path';
import SvgIconsPlugin from 'vite-plugin-svg-icons';
import mdItCustomAttrs  from 'markdown-it-custom-attrs'
import { configStyleImportPlugin } from '../../../../script/vite/plugin/styleImport';
import { generateModifyVars } from '../../../../src/common/config/generate/generateModifyVars';

function pathResolve(dir) {
  return path.resolve(process.cwd(), '.', dir);
}
export default defineConfig({
  title: '组件库文档',
  description: '整理日常前端组件',
  themeConfig: {
    repo: 'https://gitlab.yakies.cn/chumahtung/universal-vite-vue3.git',
    sidebar: [
      {
        text: '介绍',
        items: [
          { text: '组件库简介', link: '/' },
          { text: 'Getting Started', link: '/guide/' },
        ],
      },
      {
        text: '低代码组件',
        items: [
          { text: 'JsonForm', link: '/components/jsonform' },
        ],
      },
      {
        text: '媒体组件',
        items: [
          { text: 'MP4BoxVideoPlayer', link: '/components/mp4box_video_player' },
          { text: 'VideoPlayer', link: '/components/video_player' },
        ],
      },
      {
        text: 'UI组件',
        items: [
          { text: 'Icon', link: '/components/icon' },
          { text: 'VLottiePlayer', link: '/components/lottie_player' },
        ],
      },
      {
        text: '系统设计文档',
        items: [
          { text: '低代码系统设计', link: '/lowcode' },
        ],
      },
    ],
  },
  markdown:{
    config: (md) => {
        // use more markdown-it plugins!
        md.use(mdItCustomAttrs, 'image', {
            'data-fancybox': "gallery"
        })
        }
    },
  head:[
      [
          "link",
          { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css" },
      ],
      ["script", { src: "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js" }],
  ],
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(true,pathResolve('../../src/render/design/config.less')),
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve('src') + '/',
        },
      ],
      dedupe: ['vue', /primevue\/.+/], // avoid error when using dependencies that also use Vue
    },
    plugins: [purgeIcons(),SvgIconsPlugin({
      iconDirs: [
        path.resolve(process.cwd(), 'src/assets/svg'),
      ],
      svgoOptions: false,
      // default
      symbolId: 'icon-[dir]-[name]',
    }),configStyleImportPlugin()],
    server: {
      fs:{
        strict:false
      }
    }
  },
  optimizeDeps: {
    include: ['@lottiefiles/lottie-player','lodash']
  }
});
