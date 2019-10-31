import path from 'path'
import hash from 'hash-sum'
import { slash } from 'saber-utils'
import { log } from 'saber-log'
import merge from 'lodash.merge'
import getPermalink from './utils/getPermalink'
import getPageType from './utils/getPageType'
import { prefixAssets } from './utils/assetsAttribute'

// A regex parsing RFC3339 date followed by {_,-}, and ended by some characters
const FILE_NAME_REGEXP = /^(((\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(T([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(\.\d+)?(Z|(\+|-)([01]\d|2[0-3]):([0-5]\d)))?)(_|-))?(.+$)/

export interface IRedirecrtRouteConfig {
  fromPath: string
  toPath: string
  /** Make it a permanent redirect; defaults to temporary */
  redirectInBrowser?: boolean
  /**
   * Redirects are generally for redirecting legacy URLs to their new configuration. If you
   * can’t update your UI for some reason, set `redirectInBrowser` to `true` and Saber will handle
   * redirecting in the client as well.`
   */
  isPermanent?: boolean
}

export interface IFileInfo {
  relative: string
  absolute: string
  birthtime: Date
  mtime: Date
  content: string
}

export interface IAssets {
  [k: string]: string
}

export interface ICreatePageOptions {
  /** Default to `true` when not specified */
  normalize?: boolean
  file?: IFileInfo
}

export interface ICreatePageInput {
  type: 'page' | 'post'
  content: string
  /**
   * We apply different transformers based on the `contentType`
   * Built-in types are `default`, `markdown`, `vue`
   * Default to `default`
   */
  contentType?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  /**
   * Set one of `permalink` and `slug`
   * When `permalink` is set we ignore `slug`
   * Otherwise we use `config.permalinks` option with `slug` to generate a permalink
   */
  permalink?: string
  slug?: string
  assets?: IAssets
  /** Internal info is automatically removed from your app runtime for security reasons */
  internal: {
    /** A unique ID for this page */
    id: string
    /**
     * Is this page a local file?
     * If it is you also need to set `absolute` and `relative`
     */
    isFile?: boolean
    absolute?: string
    relative?: string

    /**
     * @private
     * Used by Saber internally for file watcher
     */
    saved?: boolean
  }
  /** You can also provide additonal data */
  [k: string]: any
}

export interface IPage {
  type: 'page' | 'post'
  content: string
  contentType: string
  createdAt?: Date
  updatedAt?: Date
  permalink: string
  slug?: string
  internal: {
    id: string
    isFile?: boolean
    absolute?: string
    relative?: string
    /** @private */
    saved?: boolean
  }
  attributes: IPage
  assets: IAssets
  [k: string]: any
}

export class Pages extends Map<string, IPage> {
  api: TODO
  redirectRoutes: Map<string, IRedirecrtRouteConfig>

  constructor(api: TODO) {
    super()
    this.api = api
    this.redirectRoutes = new Map()
  }

  normalizePage(_page: ICreatePageInput, file?: IFileInfo): IPage {
    const { api } = this

    let page = merge(
      {
        internal: {},
        contentType: 'default'
      },
      _page
    )

    let parsedFileName: RegExpExecArray | null = null
    if (file) {
      const relativePath = slash(file.relative)
      const absolutePath = slash(file.absolute)
      parsedFileName = FILE_NAME_REGEXP.exec(
        relativePath
          // Remove leading _posts/
          .replace(/^_posts\//, '')
          // Remove extension
          .replace(/\.[a-z]+$/i, '')
      ) as RegExpExecArray // It could never be `null`
      const slug = parsedFileName[16]
      page = merge({}, page, {
        slug,
        internal: {
          id: hash(file.absolute),
          absolute: absolutePath,
          relative: relativePath,
          isFile: true
        },
        contentType: api.transformers.getContentTypeByExtension(
          path.extname(relativePath).slice(1)
        ),
        content: file.content
      })
    }

    let transformer = api.transformers.get(page.contentType)

    if (!transformer) {
      log.warn(`No transformer was found for content type: ${page.contentType}`)
      transformer = api.transformers.get('default')
    }

    // Get page attributes from the page content
    if (transformer.parse) {
      transformer.parse(page)
    }

    // Transform page content
    if (page.content && transformer.transform) {
      transformer.transform(page)
    }

    // These fields are computed from other fields
    // And transformers can update the `page`
    // So we set them after applying the transformer

    if (file && parsedFileName) {
      // Read createdAt from page attribute
      // Or fallback to `page.date` (Hexo compatibility)
      // Or fallback to the date in fileName
      // Or fallback to the `file.birthtime`
      page.createdAt =
        page.createdAt || page.date || parsedFileName[2] || file.birthtime

      // Read updatedAt from page attribute
      // Or fallback to `page.updated` (Hexo compatibility)
      // Or fallback to `file.mtime`
      page.updatedAt = page.updatedAt || page.updated || file.mtime

      page.type = page.type || getPageType(slash(file.relative))
    }

    // Ensure date format
    if (typeof page.createdAt === 'string') {
      page.createdAt = new Date(page.createdAt)
    }
    if (typeof page.updatedAt === 'string') {
      page.updatedAt = new Date(page.updatedAt)
    }

    if (!page.permalink && page.slug) {
      page.permalink = getPermalink(
        Object.keys(api.config.locales || {})
          .map(p => p.slice(1))
          .filter(Boolean),
        { slug: page.slug, type: page.type, createdAt: page.createdAt },
        typeof api.config.permalinks === 'function'
          ? api.config.permalinks(page)
          : api.config.permalinks
      )
    }

    if (!page.internal || !page.internal.id) {
      throw new Error(`Page must have an internal id.`)
    }

    page.assets = page.assets
      ? prefixAssets(
          page.assets,
          page.internal.absolute
            ? path.dirname(page.internal.absolute)
            : api.opts.cwd
        )
      : {}

    // Ensure this page is not saved
    // So that it will be emitted to disk later in `emitPages` hook
    page.internal.saved = false

    // Backward compatible
    // TODO: remove in 1.0
    page.attributes = page

    return page as IPage
  }

  createPage(page: ICreatePageInput, options: ICreatePageOptions = {}) {
    const { file, normalize } = options
    if (normalize !== false) {
      page = this.normalizePage(page, file)
    }

    this.set(page.internal.id, page as IPage)
  }

  removePage(id: string) {
    this.removeWhere(page => {
      return page.internal.id === id
    })
  }

  removeWhere(getCondition: (page: IPage) => boolean) {
    for (const page of this.values()) {
      const condition = getCondition(page)
      if (condition) {
        this.delete(page.internal.id)
      }
    }
  }

  getPagePublicFields(page: string | IPage) {
    let result: TODO = typeof page === 'string' ? this.get(page) : page

    if (!result) {
      throw new Error(`The page doesn't exist`)
    }

    result = Object.assign({}, result, {
      content: undefined,
      internal: undefined
    })
    // TODO: remove in 1.0
    result.attributes = result

    return result as Omit<IPage, 'content' | 'internal'>
  }

  createRedirect(_configs: IRedirecrtRouteConfig | IRedirecrtRouteConfig[]) {
    if (_configs) {
      const configs = Array.isArray(_configs) ? _configs : [_configs]

      for (const config of configs) {
        this.redirectRoutes.set(config.fromPath, config)
      }
    }
  }

  getMatchedLocalePath(permalink: string) {
    const localePaths = Object.keys(this.api.config.locales || {}).filter(
      p => p !== '/'
    )

    for (const localePath of localePaths) {
      if (localePath === permalink || permalink.startsWith(localePath)) {
        return localePath
      }
    }

    return '/'
  }
}
