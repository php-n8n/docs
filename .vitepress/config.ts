import { defineConfig } from 'vitepress'

const base = normalizeBase(process.env.DOCS_BASE ?? '/')
const siteOrigin = (process.env.DOCS_SITE_ORIGIN ?? 'https://php-n8n.com').replace(/\/$/, '')
const siteUrl = base === '/' ? siteOrigin : `${siteOrigin}${base.replace(/\/$/, '')}`
const siteTitle = 'PHP n8n Client'
const siteDescription = 'Documentation for php-n8n/client, the strongly typed PHP n8n client for triggering n8n webhooks and tracking workflow executions with PSR interfaces.'
const siteImage = `${siteUrl}/php-n8n-logo.png`
const seoKeywords = [
  'php-n8n',
  'php n8n',
  'php-n8n client',
  'php n8n client',
  'php-n8n-client',
  'php-n8n/client',
  'PHP n8n Client',
  'n8n PHP client',
  'n8n webhook PHP',
  'PHP workflow automation',
  'PSR-18 n8n client',
  'n8n execution tracking PHP',
]

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'PHP n8n Client Documentation',
      alternateName: ['php-n8n', 'php n8n', 'php-n8n client', 'php n8n client', 'php-n8n/client'],
      url: siteUrl,
      description: siteDescription,
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': `${siteUrl}/#software`,
      name: 'php-n8n/client',
      alternateName: ['PHP n8n Client', 'php-n8n', 'php n8n client', 'n8n PHP client'],
      description: siteDescription,
      url: siteUrl,
      codeRepository: 'https://github.com/php-n8n/client',
      license: 'https://opensource.org/licenses/MIT',
      programmingLanguage: 'PHP',
      runtimePlatform: 'PHP 8.2+',
      keywords: seoKeywords.join(', '),
      image: siteImage,
      isAccessibleForFree: true,
    },
  ],
}

function normalizeBase(value: string): string {
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function withBase(path: string): string {
  return `${base}${path.replace(/^\//, '')}`
}

function canonicalPath(relativePath: string): string {
  let path = relativePath
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')

  path = path.replace(/\/$/, '')

  return path === '' ? '/' : `/${path}`
}

export default defineConfig({
  base,
  title: siteTitle,
  titleTemplate: ':title | php-n8n/client Documentation',
  description: siteDescription,
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: siteOrigin,
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '48x48', href: withBase('/favicon-48x48.png') }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: withBase('/favicon.svg') }],
    ['link', { rel: 'shortcut icon', href: withBase('/favicon.ico') }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: withBase('/apple-touch-icon.png') }],
    ['link', { rel: 'manifest', href: withBase('/site.webmanifest') }],
    ['link', { rel: 'alternate', type: 'text/plain', title: 'llms.txt', href: withBase('/llms.txt') }],
    ['link', { rel: 'alternate', type: 'text/plain', title: 'agents.txt', href: withBase('/agents.txt') }],
    ['meta', { name: 'theme-color', content: '#111827' }],
    ['meta', { name: 'application-name', content: siteTitle }],
    ['meta', { name: 'apple-mobile-web-app-title', content: siteTitle }],
    ['meta', { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }],
    ['meta', { name: 'keywords', content: seoKeywords.join(', ') }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { property: 'og:image', content: siteImage }],
    ['meta', { property: 'og:image:alt', content: 'PHP n8n Client documentation logo' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: siteImage }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(structuredData)],
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
    logo: withBase('/php-n8n-logo.png'),
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
