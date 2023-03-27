import DefaultTheme from 'vitepress/theme'
import PrimeVue from 'primevue/config'
import DemoContainer from '../components/DemoContainer.vue'
import MyLib from '@/'

import 'virtual:svg-icons-register'
import '@purge-icons/generated';

import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(PrimeVue)
    app.use(MyLib)
    app.component('DemoContainer', DemoContainer)
  }
}
