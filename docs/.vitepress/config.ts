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
            { text: 'Rootnode', link: '/guide/objects/rootnode' },
          ]
        },
        {
          text: 'Materials',
          items: [
            { text: 'Material basics', link: '/guide/materials/' },
            { text: 'Material list', link: '/guide/materials/materiallist' },
            { text: 'Material channels', link: '/guide/materials/channels' },
            { text: 'Colors', link: '/guide/materials/colors' },
            { text: 'Textures', link: '/guide/materials/textures' },
          ]
        },
        {
          text: 'Studio',
          items: [
            { text: 'Camera, lights, action', link: '/guide/studio/' },
          ]
        },
        {
          text: 'Annotations',
          items: [
            { text: 'Annotations', link: '/guide/annotations/' },
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
            { text: 'Attribution', link: '/about/credits' },
          ]
        }
      ]
    },
  }
})
