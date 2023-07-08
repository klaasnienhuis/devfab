import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    ssr: {
      noExternal: [ /\.css$/, /^vuetify/ ],
    },
  },
  title: "devfab",
  description: "Fab development tutorials",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Model Loading',
        items: [
          { text: 'Getting started', link: '/model-loading/getting-started' },
          { text: 'Init options', link: '/model-loading/initialization-options' },
          { text: 'Callbacks', link: '/model-loading/callbacks' },
          { text: 'Event listeners', link: '/model-loading/events' },
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
