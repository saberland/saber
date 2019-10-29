declare module 'saber' {
  interface ISaberOptions {
    cwd?: string
    dev?: boolean
    verbose?: boolean
  }

  interface ISaberConfig {
    siteConfig?: {
      [k: string]: any
    }

    themeConfig?: {
      [k: string]: any
    }

    permalinks?: IPermalinks | ((page: IPage) => IPermalinks)

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

  export interface IPermalinks {
    [pageType: string]: string
  }

  export interface IPage {
    type: string
    layout?: string
    createdAt: Date
    updatedAt: Date
    permalink: string
    slug: string
    internal: {
      id: string
      isFile?: boolean
      relative?: string
      absolute?: string
      saved?: boolean
    }
    content?: string
    contentType?: string
    [k: string]: any
  }

  type SaberPlugin =
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

  export interface ISaber {}

  export const createSaber: (
    options: ISaberOptions,
    config: ISaberConfig
  ) => ISaber
}
