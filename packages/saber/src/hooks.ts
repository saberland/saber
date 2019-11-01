import { SyncHook, AsyncSeriesHook, SyncWaterfallHook } from 'tapable'

export const hooks = {
  // Before all user plugins have been applied
  beforePlugins: new AsyncSeriesHook(),
  filterPlugins: new SyncWaterfallHook(['plugins']),
  // After all user plugins have been applied
  afterPlugins: new AsyncSeriesHook(),
  // Before running the build process
  beforeRun: new AsyncSeriesHook(),
  onUpdateConfigFile: new AsyncSeriesHook(),
  // Extend webpack config
  chainWebpack: new SyncHook(['webpackChain', 'opts']),
  getWebpackConfig: new SyncWaterfallHook(['config', 'opts']),
  // Extend markdown-it config
  chainMarkdown: new SyncHook(['config']),
  chainTemplate: new SyncHook(['config']),
  emitRoutes: new AsyncSeriesHook(),
  // Called after running webpack
  afterBuild: new AsyncSeriesHook(),
  // Called after generate static HTML files
  afterGenerate: new AsyncSeriesHook(),
  getDocumentData: new SyncWaterfallHook(['documentData', 'ssrContext']),
  getDocument: new SyncWaterfallHook(['document', 'ssrContext']),
  defineVariables: new SyncWaterfallHook(['variables']),
  // Called before creating pages for the first time
  initPages: new AsyncSeriesHook(),
  // Called when a new page is added
  onCreatePage: new AsyncSeriesHook(['page']),
  // Called when all pages are added to our `source`
  onCreatePages: new AsyncSeriesHook(),
  // Emit pages as .saberpage files when necessary
  emitPages: new AsyncSeriesHook(),
  // Call this hook to manipulate a page, it's usually used by file watcher
  manipulatePage: new AsyncSeriesHook(['data']),
  // Call when server renderer is created and updated
  onCreateRenderer: new AsyncSeriesHook(['renderer', 'isFirstTime']),
  // Called before exporting a page as static HTML file
  beforeExportPage: new AsyncSeriesHook(['context', 'exportedPage']),
  // Called after exporting a page
  afterExportPage: new AsyncSeriesHook(['context', 'exportedPage']),
  // Called after creating the server
  onCreateServer: new SyncHook(['server'])
}
