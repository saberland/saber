declare module 'saber' {
  interface Config {
    siteConfig?: {
      [k: string]: any
    }

    themeConfig?: {
      [k: string]: any
    }

    permalinks?: Permalinks | ((page: Page) => Permalinks)

    build?: {
      /**
       * The base URL your application will be deployed at.
       * If your website is located at a sub directory, e.g. `https://example.com/blog`, you should set this option to `/blog/` (trailing slash is optional).
       */
      publicUrl?: string
      extractCSS?: boolean
      loaderOptions?: any
      cssSourceMap?: boolean
      lazy?: boolean
    }

    plugins?: Plugin[]

    markdown?: {
      /**
       * The path to a module or npm package name that slugifies the markdown headers.
       * The module should have following signature:
       * ```js
       * type Slugify = (header: string) => string
       * ```
       * You can use the package `limax` which provides CJK support.
       */
      slugify?: string
      /**
       * The path to a file or npm package name that highlights code blocks in markdown.
       * `saber-highlighter-` prefix is optional.
       * Note that a highlighter will only tokenize the code, you need to add corresponding CSS yourself.
       */
      highlighter?: string
      /**
       * Options for markdown-it
       */
      options?: any
      plugins?: MarkdownItPlugin[]
    }
  }

  interface Permalinks {
    [pageType: string]: string
  }

  interface Page {
    attributes: {
      type: string
      layout?: string
      createdAt: Date
      updatedAt: Date
      permalink: string
      slug: string
      [k: string]: any
    }
    internal: {
      id: string
      isFile?: boolean
      relative?: string
      absolute?: string
      saved?: boolean
    }
    content?: string
    contentType?: string
  }

  type Plugin =
    | string
    | {
        /** The path to your plugin or an npm package name */
        resolve: string
        /** Plugin options */
        options?: object
      }

  interface MarkdownItPlugin {
    // A package name or relative path
    // e.g. markdown-it-footnote
    resolve: string
    options?: any
  }

  export { Config, Permalinks }
}
