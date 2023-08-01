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
    search: {
      provider: 'local'
    },
    footer: {
      copyright: 'Copyright © 2023-present Klaas Nienhuis'
    },
    nav: [
      { text: 'Guide', link: '/guide/model-loading/getting-started' },
      { text: 'About', link: '/about/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Model Loading',
          items: [
            { text: 'Getting started', link: '/guide/model-loading/getting-started' },
            { text: 'Init options', link: '/guide/model-loading/initialization-options' },
            { text: 'Callbacks', link: '/guide/model-loading/callbacks' },
            { text: 'Event listeners', link: '/guide/model-loading/events' },
          ]
        },
        {
          text: 'Objects',
          items: [
            { text: 'Nodemap', link: '/guide/objects/nodemap' },
            { text: 'Scenegraph', link: '/guide/objects/scenegraph' },
            { text: 'Showing and hiding', link: '/guide/objects/object-visibility' },
          ]
        },
      ],
      '/about/': [
        {
          text: 'About',
          items: [
            { text: 'Introduction', link: '/about/' },
            { text: 'Examples', link: '/about/examples'},
            { text: 'Contact', link: '/about/contact' },
          ]
        }
      ]
    },
  }
})
