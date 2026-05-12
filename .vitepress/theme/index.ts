import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-before': () => h('h1', { class: 'php-n8n-home-title' }, [
        h('span', { class: 'php-n8n-home-title-php' }, 'PHP'),
        ' ',
        h('span', { class: 'php-n8n-home-title-n8n' }, 'n8n'),
        ' ',
        h('span', { class: 'php-n8n-home-title-client' }, 'Client'),
      ]),
    })
  },
}
