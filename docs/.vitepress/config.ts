import { createContentLoader, defineConfig, HeadConfig  } from 'vitepress'
import { SitemapStream } from 'sitemap'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // transformHead: ({ pageData }) => {
  //   const head: HeadConfig[] = [
  //     ['meta', {name: 'og:author', content: 'Klaas Nienhuis'}],
  //     // ['meta', {property: 'og:title', content: 'Learn the Sketchfab API'}],
  //     ['meta', {property: 'og:description', content: 'Create your own interactive 3D experiences with Sketchfab'}],
  //     ['meta', {property: 'og:tag', content: '[sketchfab, api, tutorials]'}],
  //   ]
    
  //   head.push(['meta', { 
  //     name: 'og:title',
  //     content: 
  //       pageData.frontmatter.title ? pageData.frontmatter.title : 'Learn the Sketchfab API'
  //   }])
  //   head.push(['meta', { property: 'og:description', content: pageData.frontmatter.description }])
  //   head.push(['meta', { property: 'og:tag', content: pageData.frontmatter.tag }])
    
  //   return head
  // },
  transformPageData(pageData) {
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'meta',
      {
        name: 'og:author',
        content: 'Klaas Nienhuis'
      }
    ])
    pageData.frontmatter.head.push([
      'meta',
      {
        name: 'og:type',
        content: 'article'
      }
    ])
    pageData.frontmatter.head.push([
      'meta',
      {
        name: 'og:title',
        content:
          pageData.frontmatter.title
            ? pageData.frontmatter.title
            : 'Learn the Sketchfab API'
      }
    ])
    pageData.frontmatter.head.push([
      'meta',
      {
        property: 'og:description',
        content:
          pageData.frontmatter.description
            ? pageData.frontmatter.description
            : 'Create your own interactive 3D experiences with Sketchfab'
      }
    ])
    pageData.frontmatter.head.push([
      'meta',
      {
        property: 'og:image',
        content:
          pageData.frontmatter.image
            ? pageData.frontmatter.image
            : '/images/og-devfab.jpg'
      }
    ])
  },
  lastUpdated: true,
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: 'https://devfab.io/' })
    const pages = await createContentLoader('**/*.md').load()
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))

    sitemap.pipe(writeStream)
    pages.forEach((page) => sitemap.write(
      page.url
        // Strip `index.html` from URL
        .replace(/index.html$/g, '')
        // Optional: if Markdown files are located in a subfolder
        .replace(/^\/guide/, '')
      ))
    sitemap.end()

    await new Promise((r) => writeStream.on('finish', r))
  },  
  // head: [
  //   ['meta', {name: 'og:author', content: 'Klaas Nienhuis'}],
  // ],
  vite: {
    ssr: {
      noExternal: [ /\.css$/, /^vuetify/ ],
    },
  },
  title: "devfab.io",
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
      { text: 'Projects', link: '/projects/' },
      { text: 'About', link: '/about/' },
    ],
    outline: {
      level: [2, 3],
    },
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
          text: 'Camera',
          items: [
            { text: 'Camera basics', link: '/guide/camera/' },
            { text: 'Camera Constraints', link: '/guide/camera/camera-constraints' },
            { text: 'Rendering', link: '/guide/camera/rendering' },
          ]
        },
        {
          text: 'Studio',
          items: [
            { text: 'Overview', link: '/guide/studio/' },
            { text: 'Background', link: '/guide/studio/background' },
            { text: 'Lights', link: '/guide/studio/lighting' },
            { text: 'Environment', link: '/guide/studio/environment' },
            { text: 'Postprocessing', link: '/guide/studio/postprocessing' },
          ]
        },
        {
          text: 'Annotations',
          items: [
            { text: 'Annotations', link: '/guide/annotations/' },
          ]
        },
      ],
      '/projects/': [
        {
          text: 'Projects',
          items: [
            { text: 'Introduction', link: '/projects/' },
          ]
        }
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
