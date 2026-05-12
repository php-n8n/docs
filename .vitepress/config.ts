import { defineConfig } from 'vitepress'

const siteUrl = 'https://php-n8n.com'
const siteTitle = 'PHP n8n Client'
const siteDescription = 'Strongly typed, PSR-only PHP client for triggering n8n webhooks and tracking workflow executions.'

function canonicalPath(relativePath: string): string {
  let path = relativePath
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')

  path = path.replace(/\/$/, '')

  return path === '' ? '/' : `/${path}`
}

export default defineConfig({
  title: siteTitle,
  description: siteDescription,
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: siteUrl,
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/php-n8n-logo.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/php-n8n-logo.png' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'keywords', content: 'PHP n8n client, n8n webhook PHP, PSR-18 n8n client, PHP workflow automation, n8n execution tracking' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],
  transformHead({ pageData }) {
    const url = `${siteUrl}${canonicalPath(pageData.relativePath)}`
    const title = pageData.title ? `${pageData.title} | ${siteTitle}` : siteTitle
    const description = pageData.description || siteDescription

    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
  },
  themeConfig: {
    logo: '/php-n8n-logo.png',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Class Reference', link: '/reference/' },
      {
        text: 'v1',
        activeMatch: '^/',
        items: [
          { text: 'v1 current', link: '/versions' },
        ],
      },
      { text: 'Community', link: '/community/contributing' },
      { text: 'Changelog', link: '/changelog' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Why This Client', link: '/guide/why-php-n8n-client' },
            { text: 'Client Setup', link: '/guide/client-setup' },
            { text: 'Webhooks', link: '/guide/webhooks' },
            { text: 'Execution Tracking', link: '/guide/execution-tracking' },
            { text: 'Lifecycle Hooks', link: '/guide/lifecycle-hooks' },
            { text: 'Error Handling', link: '/guide/error-handling' },
            { text: 'Laravel Usage', link: '/guide/laravel' },
            { text: 'Advanced Usage', link: '/guide/advanced-usage' },
            { text: 'Testing', link: '/guide/testing' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Class Reference',
          items: [
            { text: 'Overview', link: '/reference/' },
            { text: 'Client', link: '/reference/client' },
            { text: 'Config', link: '/reference/config' },
            { text: 'Webhooks', link: '/reference/webhooks' },
            { text: 'Executions', link: '/reference/executions' },
            { text: 'Hooks', link: '/reference/hooks' },
            { text: 'Contracts', link: '/reference/contracts' },
            { text: 'Exceptions', link: '/reference/exceptions' },
          ],
        },
      ],
      '/community/': [
        {
          text: 'Community',
          items: [
            { text: 'Contributing', link: '/community/contributing' },
            { text: 'Contributors', link: '/community/contributors' },
            { text: 'Ecosystem', link: '/community/ecosystem' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/php-n8n/client' },
    ],
    editLink: {
      pattern: 'https://github.com/php-n8n/docs/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 php-n8n contributors',
    },
  },
})
