# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.7](https://github.com/saberland/saber/compare/saber@0.6.6...saber@0.6.7) (2019-05-29)

### Bug Fixes

- decode route hash before scrolling ([b496a00](https://github.com/saberland/saber/commit/b496a00))
- regression in applyPlugin ([9d01d65](https://github.com/saberland/saber/commit/9d01d65))

## [0.6.6](https://github.com/saberland/saber/compare/saber@0.6.5...saber@0.6.6) (2019-05-29)

### Bug Fixes

- make filterPlugins work in saber-node.js ([#221](https://github.com/saberland/saber/issues/221)) ([f3ec588](https://github.com/saberland/saber/commit/f3ec588))
- Scroll to anchor not working [#213](https://github.com/saberland/saber/issues/213) ([#214](https://github.com/saberland/saber/issues/214)) ([2286ecd](https://github.com/saberland/saber/commit/2286ecd))

### Features

- add support to line numbers in markdown ([#217](https://github.com/saberland/saber/issues/217)) ([1561c61](https://github.com/saberland/saber/commit/1561c61)), closes [#178](https://github.com/saberland/saber/issues/178) [#178](https://github.com/saberland/saber/issues/178)

## [0.6.5](https://github.com/saberland/saber/compare/saber@0.6.4...saber@0.6.5) (2019-05-28)

### Bug Fixes

- **vue-renderer:** default slot might not exist ([91132a2](https://github.com/saberland/saber/commit/91132a2))
- check for port only in initial setConfig run ([#215](https://github.com/saberland/saber/issues/215)) ([d778282](https://github.com/saberland/saber/commit/d778282))
- only check port once ([0b861c4](https://github.com/saberland/saber/commit/0b861c4))
- support beforePlugins hook in saber-node.js ([9b12cd2](https://github.com/saberland/saber/commit/9b12cd2))

### Features

- add beforePlugins hook ([dd018d5](https://github.com/saberland/saber/commit/dd018d5))
- add onUpdateConfigFile hook ([de8574f](https://github.com/saberland/saber/commit/de8574f))

## [0.6.4](https://github.com/saberland/saber/compare/saber@0.6.3...saber@0.6.4) (2019-05-25)

### Bug Fixes

- **link-plugin:** remove redundant slash ([#211](https://github.com/saberland/saber/issues/211)) ([3be3592](https://github.com/saberland/saber/commit/3be3592)), closes [#205](https://github.com/saberland/saber/issues/205)

### Features

- run saber server on 3001 port if 3000 is unavailable ([#184](https://github.com/saberland/saber/issues/184)) ([d5d5632](https://github.com/saberland/saber/commit/d5d5632)), closes [#182](https://github.com/saberland/saber/issues/182)

## [0.6.3](https://github.com/egoist/saber/compare/saber@0.6.2...saber@0.6.3) (2019-05-21)

### Bug Fixes

- **markdown:** escape html in heading slug ([777ed4a](https://github.com/egoist/saber/commit/777ed4a))

### Features

- add component ClientOnly ([391183c](https://github.com/egoist/saber/commit/391183c))

## [0.6.2](https://github.com/egoist/saber/compare/saber@0.6.1...saber@0.6.2) (2019-05-11)

### Bug Fixes

- **markdown:** code blocks should alway have a class name ([53f9433](https://github.com/egoist/saber/commit/53f9433))
- **webpack:** do not include path in output filename in production ([faff48a](https://github.com/egoist/saber/commit/faff48a))

## [0.6.1](https://github.com/egoist/saber/compare/saber@0.6.0...saber@0.6.1) (2019-05-11)

### Features

- plugin for generating responsive images ([#150](https://github.com/egoist/saber/issues/150)) ([d2ed81c](https://github.com/egoist/saber/commit/d2ed81c))

# [0.6.0](https://github.com/egoist/saber/compare/saber@0.5.4...saber@0.6.0) (2019-05-11)

### Bug Fixes

- frontmatter asset loading, fixes [#169](https://github.com/egoist/saber/issues/169) ([#170](https://github.com/egoist/saber/issues/170)) ([7ba1114](https://github.com/egoist/saber/commit/7ba1114))
- never add new properties to page.attributes ([d0ddafe](https://github.com/egoist/saber/commit/d0ddafe))
- remove pages.extendPageProp ([5cafde8](https://github.com/egoist/saber/commit/5cafde8))
- switch back to devalue for cyclical references support ([02e976b](https://github.com/egoist/saber/commit/02e976b))

### Features

- prettify output page component ([992a6a3](https://github.com/egoist/saber/commit/992a6a3))
- remove trailing slash in permalink ([405157f](https://github.com/egoist/saber/commit/405157f))

### BREAKING CHANGES

- `api.pages.extendPageProp` is removed, you should directly mutate `page` object instead

## [0.5.4](https://github.com/egoist/saber/compare/saber@0.5.3...saber@0.5.4) (2019-05-10)

### Bug Fixes

- don't emit error when using new public output folder ([39d5784](https://github.com/egoist/saber/commit/39d5784))

### Features

- handling assets attribute with webpack ([#165](https://github.com/egoist/saber/issues/165)) ([d35850c](https://github.com/egoist/saber/commit/d35850c))

## [0.5.3](https://github.com/egoist/saber/compare/saber@0.5.2...saber@0.5.3) (2019-05-08)

### Bug Fixes

- throw error when using old public folder in all commands ([b8d92f7](https://github.com/egoist/saber/commit/b8d92f7))

## [0.5.2](https://github.com/egoist/saber/compare/saber@0.5.1...saber@0.5.2) (2019-05-08)

### Bug Fixes

- add missing file ([3b67bc0](https://github.com/egoist/saber/commit/3b67bc0))

## [0.5.1](https://github.com/egoist/saber/compare/saber@0.5.0...saber@0.5.1) (2019-05-08)

### Bug Fixes

- **vue-renderer:** only add data-saber-ssr attribute in production mode ([09c8d34](https://github.com/egoist/saber/commit/09c8d34))

# [0.5.0](https://github.com/egoist/saber/compare/saber@0.4.10...saber@0.5.0) (2019-05-08)

### Bug Fixes

- inject ssrContext to the params of getDocument, getDocumentData hooks ([0f6669e](https://github.com/egoist/saber/commit/0f6669e))
- **deps:** update dependency webpack-chain to v6 ([#158](https://github.com/egoist/saber/issues/158)) ([3bfc1c7](https://github.com/egoist/saber/commit/3bfc1c7))

### Features

- add hooks.getDocumentData ([a9bb9b2](https://github.com/egoist/saber/commit/a9bb9b2))
- add markdown-it plugin to collect headings ([#145](https://github.com/egoist/saber/issues/145)) ([4715558](https://github.com/egoist/saber/commit/4715558))
- add saber-plugin-pwa ([#149](https://github.com/egoist/saber/issues/149)) ([7e5c298](https://github.com/egoist/saber/commit/7e5c298))
- i18n support ([#137](https://github.com/egoist/saber/issues/137)) ([1613626](https://github.com/egoist/saber/commit/1613626))

## [0.4.10](https://github.com/egoist/saber/compare/saber@0.4.9...saber@0.4.10) (2019-05-03)

### Bug Fixes

- invalid URL error ([#139](https://github.com/egoist/saber/issues/139)) ([636cd72](https://github.com/egoist/saber/commit/636cd72))
- set default options for vue-loader ([9195df5](https://github.com/egoist/saber/commit/9195df5))

### Features

- add browser api: setHead, setRootComponent ([9bca0cd](https://github.com/egoist/saber/commit/9bca0cd))
- change output directory ([#142](https://github.com/egoist/saber/issues/142)) ([2b2f8cc](https://github.com/egoist/saber/commit/2b2f8cc))

## [0.4.9](https://github.com/egoist/saber/compare/saber@0.4.8...saber@0.4.9) (2019-05-02)

### Bug Fixes

- **core:** fix plugins options not loaded ([#131](https://github.com/egoist/saber/issues/131)) ([09da7a8](https://github.com/egoist/saber/commit/09da7a8))
- **deps:** update dependency chokidar to v3 ([#122](https://github.com/egoist/saber/issues/122)) ([9149fdd](https://github.com/egoist/saber/commit/9149fdd))
- **deps:** update dependency pretty-ms to v5 ([#123](https://github.com/egoist/saber/issues/123)) ([b6de2c7](https://github.com/egoist/saber/commit/b6de2c7))
- **deps:** update dependency resolve-from to v5 ([#124](https://github.com/egoist/saber/issues/124)) ([e10a4a3](https://github.com/egoist/saber/commit/e10a4a3))

## [0.4.8](https://github.com/egoist/saber/compare/saber@0.4.8-canary.2...saber@0.4.8) (2019-05-01)

**Note:** Version bump only for package saber

## [0.4.8-canary.2](https://github.com/egoist/saber/compare/saber@0.4.8-canary.1...saber@0.4.8-canary.2) (2019-05-01)

### Bug Fixes

- **deps:** update dependency mini-css-extract-plugin to ^0.6.0 ([#93](https://github.com/egoist/saber/issues/93)) ([e642875](https://github.com/egoist/saber/commit/e642875))

## [0.4.8-canary.1](https://github.com/egoist/saber/compare/saber@0.4.8-canary.0...saber@0.4.8-canary.1) (2019-05-01)

### Bug Fixes

- a huge mistake ([8a6401f](https://github.com/egoist/saber/commit/8a6401f))

## [0.4.8-canary.0](https://github.com/egoist/saber/compare/saber@0.4.7...saber@0.4.8-canary.0) (2019-05-01)

### Bug Fixes

- hash the original filepath ([2a0d03e](https://github.com/egoist/saber/commit/2a0d03e))
- use slash for filepath ([#90](https://github.com/egoist/saber/issues/90)), closes [#67](https://github.com/egoist/saber/issues/67) ([8f23e65](https://github.com/egoist/saber/commit/8f23e65))

### Features

- add api.applyPlugin ([79c7a9c](https://github.com/egoist/saber/commit/79c7a9c))
- add plugin property: filterPlugins ([69946c8](https://github.com/egoist/saber/commit/69946c8))

## [0.4.7](https://github.com/egoist/saber/compare/saber@0.4.6...saber@0.4.7) (2019-04-29)

### Bug Fixes

- disable vue prodution tip ([07bb217](https://github.com/egoist/saber/commit/07bb217))
- set the default value for page.contentType ([d5fc5d7](https://github.com/egoist/saber/commit/d5fc5d7))

## [0.4.6](https://github.com/egoist/saber/compare/saber@0.4.5...saber@0.4.6) (2019-04-29)

### Bug Fixes

- beforeEnter hook ([#77](https://github.com/egoist/saber/issues/77)) ([bcef9f7](https://github.com/egoist/saber/commit/bcef9f7))
- ensure req.headers ([ec264d1](https://github.com/egoist/saber/commit/ec264d1))
- render error for pages with no defaultSlot ([#78](https://github.com/egoist/saber/issues/78)) ([fce58e7](https://github.com/egoist/saber/commit/fce58e7))
- use router.matcher ([d5ae9b1](https://github.com/egoist/saber/commit/d5ae9b1))

### Features

- exclude css for line highlighting ([9c49257](https://github.com/egoist/saber/commit/9c49257))
- inject saber-highlight.css on demand ([7a7c65f](https://github.com/egoist/saber/commit/7a7c65f))
- inject saber-highlight.css on demand (another attempt) ([3b30ce2](https://github.com/egoist/saber/commit/3b30ce2))

## [0.4.5](https://github.com/egoist/saber/compare/saber@0.4.4...saber@0.4.5) (2019-04-27)

### Bug Fixes

- get rid of the hack for hot reloading vue-router routes ([5903f92](https://github.com/egoist/saber/commit/5903f92))
- use corresponding leave transition ([#73](https://github.com/egoist/saber/issues/73)) ([f31af42](https://github.com/egoist/saber/commit/f31af42))

### Features

- add saber-plugin-transformer-html ([dbd5258](https://github.com/egoist/saber/commit/dbd5258))
- add saber-plugin-transformer-pug ([edc7891](https://github.com/egoist/saber/commit/edc7891))
- support transition in layout component, closes [#66](https://github.com/egoist/saber/issues/66) ([afcec88](https://github.com/egoist/saber/commit/afcec88))

## [0.4.4](https://github.com/egoist/saber/compare/saber@0.4.3...saber@0.4.4) (2019-04-27)

### Bug Fixes

- use devalue instead of JSON.stringify to serialize page prop ([8f57885](https://github.com/egoist/saber/commit/8f57885))

### Features

- update progress bar for build process ([19ced0e](https://github.com/egoist/saber/commit/19ced0e))

## [0.4.3](https://github.com/egoist/saber/compare/saber@0.4.2...saber@0.4.3) (2019-04-15)

### Bug Fixes

- return the link directly in getPageLink if it's not a page ([da876de](https://github.com/egoist/saber/commit/da876de))
- simplify the default layout ([8480b74](https://github.com/egoist/saber/commit/8480b74))
- **css:** set font-size for highlight mask ([bdb761e](https://github.com/egoist/saber/commit/bdb761e))
- **vue-renderer:** fix scrollBehavior for page transition ([f3445d6](https://github.com/egoist/saber/commit/f3445d6))
- **vue-renderer:** set transition after extendBrowserApi ([9499b12](https://github.com/egoist/saber/commit/9499b12))

### Features

- redirect support ([#56](https://github.com/egoist/saber/issues/56)) ([48c913f](https://github.com/egoist/saber/commit/48c913f))
- resolve .vue files automatically ([186cb29](https://github.com/egoist/saber/commit/186cb29))
- support page transition ([5af96c7](https://github.com/egoist/saber/commit/5af96c7))

## [0.4.2](https://github.com/egoist/saber/compare/saber@0.4.1...saber@0.4.2) (2019-04-12)

### Bug Fixes

- better error log ([600b8a9](https://github.com/egoist/saber/commit/600b8a9))
- correctly transform <script> blocks in .js pages ([cddc879](https://github.com/egoist/saber/commit/cddc879))
- enable sourcemap for server build ([631a051](https://github.com/egoist/saber/commit/631a051))
- make getPageLink fail loudly in production build ([f45c4e3](https://github.com/egoist/saber/commit/f45c4e3))
- rewrite the webpack rules for handling pages ([8186171](https://github.com/egoist/saber/commit/8186171))
- **cli:** handle unhandled promise rejection ([bbb9a4e](https://github.com/egoist/saber/commit/bbb9a4e))
- **dependency:** update vue router ([cf3e8c6](https://github.com/egoist/saber/commit/cf3e8c6))
- **hmr:** hopefully fixed the hot reloading issue in .md pages ([8a75ce6](https://github.com/egoist/saber/commit/8a75ce6))
- **markdown:** line highlighting style ([f5311f2](https://github.com/egoist/saber/commit/f5311f2))

### Features

- add @ alias for project root ([7b0b28a](https://github.com/egoist/saber/commit/7b0b28a))

## [0.4.1](https://github.com/egoist/saber/compare/saber@0.4.0...saber@0.4.1) (2019-04-09)

### Bug Fixes

- disable css sourcemaps ([cffab6f](https://github.com/egoist/saber/commit/cffab6f))

# [0.4.0](https://github.com/egoist/saber/compare/saber@0.3.7...saber@0.4.0) (2019-04-09)

### Bug Fixes

- host name ([cc6edb3](https://github.com/egoist/saber/commit/cc6edb3))
- lazy page compilation ([163e3e6](https://github.com/egoist/saber/commit/163e3e6))
- transform renderer app ([5a0d53d](https://github.com/egoist/saber/commit/5a0d53d))
- update types ([41c774a](https://github.com/egoist/saber/commit/41c774a))
- use the pathname only ([34316d2](https://github.com/egoist/saber/commit/34316d2))
- **dependency:** update joycon ([cb55e1e](https://github.com/egoist/saber/commit/cb55e1e))

### Features

- add chainMarkdown hook ([9891c0a](https://github.com/egoist/saber/commit/9891c0a))
- build page on demand ([#50](https://github.com/egoist/saber/issues/50)) ([9acc0ea](https://github.com/egoist/saber/commit/9acc0ea))
- deprecate saber generate in favor of saber build ([22270f8](https://github.com/egoist/saber/commit/22270f8))
- display a message on SIGINT ([0c217b0](https://github.com/egoist/saber/commit/0c217b0))
- output fewer logs ([d3a68ea](https://github.com/egoist/saber/commit/d3a68ea))
- watch and reload saber-node.js again ([e624178](https://github.com/egoist/saber/commit/e624178))

## [0.3.7](https://github.com/egoist/saber/compare/saber@0.3.6...saber@0.3.7) (2019-04-05)

### Bug Fixes

- match \r\n in front matter ([0906ae6](https://github.com/egoist/saber/commit/0906ae6))
- typo ([e808f2c](https://github.com/egoist/saber/commit/e808f2c))

### Features

- add build.cssSourceMap build.loaderOptions build.extractCSS ([2fb6a5d](https://github.com/egoist/saber/commit/2fb6a5d))

## [0.3.6](https://github.com/egoist/saber/compare/saber@0.3.5...saber@0.3.6) (2019-04-02)

### Bug Fixes

- allow to configure css ([e5dab27](https://github.com/egoist/saber/commit/e5dab27))

## [0.3.5](https://github.com/egoist/saber/compare/saber@0.3.4...saber@0.3.5) (2019-04-02)

### Bug Fixes

- add hook handler from saber-node.js using proper method ([7c3a654](https://github.com/egoist/saber/commit/7c3a654))

## [0.3.3](https://github.com/egoist/saber/compare/saber@0.3.2...saber@0.3.3) (2019-03-31)

### Features

- support reading page.attributes.updated ([#41](https://github.com/egoist/saber/issues/41)) ([05011b6](https://github.com/egoist/saber/commit/05011b6))

## [0.3.2](https://github.com/egoist/saber/compare/saber@0.3.1...saber@0.3.2) (2019-03-31)

### Bug Fixes

- convert backslash in page, closes [#37](https://github.com/egoist/saber/issues/37) [#38](https://github.com/egoist/saber/issues/38) ([66509a9](https://github.com/egoist/saber/commit/66509a9))

## [0.3.1](https://github.com/egoist/saber/compare/saber@0.3.0...saber@0.3.1) (2019-03-27)

### Bug Fixes

- fix path to highlight-plugin ([37c3889](https://github.com/egoist/saber/commit/37c3889))

# [0.3.0](https://github.com/egoist/saber/compare/saber@0.2.26...saber@0.3.0) (2019-03-27)

### Bug Fixes

- update default style for code block ([cdc2ed4](https://github.com/egoist/saber/commit/cdc2ed4))

### Features

- support extracting datetime from post filename ([#32](https://github.com/egoist/saber/issues/32)) ([3334bce](https://github.com/egoist/saber/commit/3334bce)), closes [#31](https://github.com/egoist/saber/issues/31)

## [0.2.26](https://github.com/egoist/saber/compare/saber@0.2.25...saber@0.2.26) (2019-03-26)

### Features

- allow to use prebuilt theme ([54a0365](https://github.com/egoist/saber/commit/54a0365))

## [0.2.25](https://github.com/egoist/saber/compare/saber@0.2.24...saber@0.2.25) (2019-03-24)

### Bug Fixes

- don't externalize saber/variables ([a885d4a](https://github.com/egoist/saber/commit/a885d4a))

## [0.2.24](https://github.com/egoist/saber/compare/saber@0.2.23...saber@0.2.24) (2019-03-24)

### Features

- inject **PUBLIC_URL** ([3c63ebf](https://github.com/egoist/saber/commit/3c63ebf))
- inject feed info as constants ([07457d3](https://github.com/egoist/saber/commit/07457d3))

## [0.2.23](https://github.com/egoist/saber/compare/saber@0.2.22...saber@0.2.23) (2019-03-23)

### Bug Fixes

- make page as unsaved when page prop changes ([eb7358e](https://github.com/egoist/saber/commit/eb7358e))
- only write pages when the page data changes ([a83843f](https://github.com/egoist/saber/commit/a83843f))
- reload browser when routes.js or layouts.js changes ([ab7097d](https://github.com/egoist/saber/commit/ab7097d))

## [0.2.22](https://github.com/egoist/saber/compare/saber@0.2.21...saber@0.2.22) (2019-03-21)

### Bug Fixes

- convert backslash in <page-component> ([ec49371](https://github.com/egoist/saber/commit/ec49371))
- support node 8 ([679510f](https://github.com/egoist/saber/commit/679510f))

## [0.2.21](https://github.com/egoist/saber/compare/saber@0.2.20...saber@0.2.21) (2019-03-21)

### Bug Fixes

- replace path with upath for windows compatibility ([6e4db77](https://github.com/egoist/saber/commit/6e4db77))
- require node 10 ([c2e3723](https://github.com/egoist/saber/commit/c2e3723))

### Features

- support sub directory ([a46d17d](https://github.com/egoist/saber/commit/a46d17d))

## [0.2.20](https://github.com/egoist/saber/compare/saber@0.2.19...saber@0.2.20) (2019-03-21)

### Bug Fixes

- correctly load saber-browser.js in theme directory ([7aff5b6](https://github.com/egoist/saber/commit/7aff5b6))

## [0.2.19](https://github.com/egoist/saber/compare/saber@0.2.18...saber@0.2.19) (2019-03-21)

**Note:** Version bump only for package saber

## [0.2.18](https://github.com/egoist/saber/compare/saber@0.2.17...saber@0.2.18) (2019-03-20)

### Bug Fixes

- beforeCreate can be an array ([aeae66b](https://github.com/egoist/saber/commit/aeae66b))

## [0.2.17](https://github.com/egoist/saber/compare/saber@0.2.16...saber@0.2.17) (2019-03-20)

### Bug Fixes

- getPagePublicFields ([1a2953e](https://github.com/egoist/saber/commit/1a2953e))

## [0.2.16](https://github.com/egoist/saber/compare/saber@0.2.15...saber@0.2.16) (2019-03-20)

### Bug Fixes

- use a new Map to store addtional page prop ([3afb7b8](https://github.com/egoist/saber/commit/3afb7b8))

## [0.2.15](https://github.com/egoist/saber/compare/saber@0.2.14...saber@0.2.15) (2019-03-20)

### Features

- support saber-node.js in theme directory ([44c30b6](https://github.com/egoist/saber/commit/44c30b6))

## [0.2.14](https://github.com/egoist/saber/compare/saber@0.2.13...saber@0.2.14) (2019-03-13)

### Bug Fixes

- ensure configPath ([e5dae8c](https://github.com/egoist/saber/commit/e5dae8c))

## [0.2.13](https://github.com/egoist/saber/compare/saber@0.2.12...saber@0.2.13) (2019-03-13)

### Bug Fixes

- **windows:** convert back slashes, closes [#27](https://github.com/egoist/saber/issues/27) ([aefcd09](https://github.com/egoist/saber/commit/aefcd09))

### Features

- implement saber/request ([b1d30f7](https://github.com/egoist/saber/commit/b1d30f7))
- show warning when config file is updated ([344534f](https://github.com/egoist/saber/commit/344534f))
- support relative links to markdown pages, closes [#25](https://github.com/egoist/saber/issues/25) ([0a2440e](https://github.com/egoist/saber/commit/0a2440e))

## [0.2.12](https://github.com/egoist/saber/compare/saber@0.2.11...saber@0.2.12) (2019-02-28)

### Bug Fixes

- ensure code blocks are always escaped ([8f4eea5](https://github.com/egoist/saber/commit/8f4eea5))
- tweak css for code blocks ([6808274](https://github.com/egoist/saber/commit/6808274))

### Features

- use layouts from project root ([9d1662b](https://github.com/egoist/saber/commit/9d1662b))

## [0.2.11](https://github.com/egoist/saber/compare/saber@0.2.10...saber@0.2.11) (2019-02-18)

### Bug Fixes

- register node apis earlier ([0e3019d](https://github.com/egoist/saber/commit/0e3019d))

## [0.2.10](https://github.com/egoist/saber/compare/saber@0.2.9...saber@0.2.10) (2019-02-18)

### Bug Fixes

- **babel:** add babel-runtime ([c1652f7](https://github.com/egoist/saber/commit/c1652f7))

### Features

- add getDocument hook ([c9f7f7b](https://github.com/egoist/saber/commit/c9f7f7b))

## [0.2.9](https://github.com/egoist/saber/compare/saber@0.2.8...saber@0.2.9) (2019-02-17)

### Bug Fixes

- css for code blocks ([111e4e8](https://github.com/egoist/saber/commit/111e4e8))

## [0.2.8](https://github.com/egoist/saber/compare/saber@0.2.7...saber@0.2.8) (2019-02-17)

### Bug Fixes

- **markdown:** ensure link href ([b501a0c](https://github.com/egoist/saber/commit/b501a0c))

### Features

- add saber-generator-feed ([87b8e32](https://github.com/egoist/saber/commit/87b8e32))

## [0.2.7](https://github.com/egoist/saber/compare/saber@0.2.6...saber@0.2.7) (2019-02-17)

### Bug Fixes

- don't externalize saber/config ([ae6625f](https://github.com/egoist/saber/commit/ae6625f))

## [0.2.6](https://github.com/egoist/saber/compare/saber@0.2.5...saber@0.2.6) (2019-02-17)

### Features

- add alias saber/config ([c320360](https://github.com/egoist/saber/commit/c320360))
- add basic support for saber-node.js ([f5ed846](https://github.com/egoist/saber/commit/f5ed846))
- add blog plugin ([5621dbe](https://github.com/egoist/saber/commit/5621dbe))
- generate excerpt for markdown pages ([3f1220f](https://github.com/egoist/saber/commit/3f1220f))
- generate tags page ([67c4e0e](https://github.com/egoist/saber/commit/67c4e0e))
- serve public folder in themes ([056b2fe](https://github.com/egoist/saber/commit/056b2fe))
- simplify custom blocks in page component ([a9b11f6](https://github.com/egoist/saber/commit/a9b11f6))
- support all hooks in saber-node.js ([50f6072](https://github.com/egoist/saber/commit/50f6072))
- support line highlighting in code blocks ([d4575ef](https://github.com/egoist/saber/commit/d4575ef))
- use 3000 as default port ([4ef1600](https://github.com/egoist/saber/commit/4ef1600))

## [0.2.5](https://github.com/egoist/saber/compare/saber@0.2.4...saber@0.2.5) (2019-02-15)

### Bug Fixes

- use cjs in generated browser-api file ([e14b063](https://github.com/egoist/saber/commit/e14b063))
- use memory fs for server build in dev mode ([0e9c06d](https://github.com/egoist/saber/commit/0e9c06d))

### Features

- add --ssr flag ([cf86954](https://github.com/egoist/saber/commit/cf86954))
- emitting pages when necessary ([58f9892](https://github.com/egoist/saber/commit/58f9892))
- layout needs to be explicitly specified ([bbdff19](https://github.com/egoist/saber/commit/bbdff19))

## [0.2.4](https://github.com/egoist/saber/compare/saber@0.2.3...saber@0.2.4) (2019-02-13)

### Bug Fixes

- convert markdown links to saber-link ([90a8bce](https://github.com/egoist/saber/commit/90a8bce))
- keep layouts in main bundle for now ([8c2c181](https://github.com/egoist/saber/commit/8c2c181))
- prefetch whenever possible ([a49afd8](https://github.com/egoist/saber/commit/a49afd8))
- process.browser ([0979cdc](https://github.com/egoist/saber/commit/0979cdc))
- use a fork of postcss-loader ([0d67668](https://github.com/egoist/saber/commit/0d67668))

### Features

- add 404 page ([2503e2f](https://github.com/egoist/saber/commit/2503e2f))
- add command serve ([0b4120e](https://github.com/egoist/saber/commit/0b4120e))
- enable ssr in dev mode as well ([837f696](https://github.com/egoist/saber/commit/837f696))
- lazy-load layout components ([daf8660](https://github.com/egoist/saber/commit/daf8660))
- separate build and generate ([ad595ca](https://github.com/egoist/saber/commit/ad595ca))

## [0.2.3](https://github.com/egoist/saber/compare/saber@0.2.2...saber@0.2.3) (2019-01-22)

### Bug Fixes

- strip content and internal from post list ([8b24548](https://github.com/egoist/saber/commit/8b24548))

### Features

- show compile time ([2fd10f4](https://github.com/egoist/saber/commit/2fd10f4))
- support prefetch prop in saber-link ([56dbac8](https://github.com/egoist/saber/commit/56dbac8))

## [0.2.2](https://github.com/egoist/saber/compare/saber@0.2.1...saber@0.2.2) (2019-01-21)

### Bug Fixes

- typo ([958b0dd](https://github.com/egoist/saber/commit/958b0dd))

# 0.2.0 (2019-01-21)

### Bug Fixes

- add doctype to html template ([f919074](https://github.com/egoist/saber/commit/f919074))
- externalize resource with querystring ([642f754](https://github.com/egoist/saber/commit/642f754))
- prevent from importing duplicated vue ([e373d02](https://github.com/egoist/saber/commit/e373d02))

### Features

- support markdown highlighter ([5c8ec2e](https://github.com/egoist/saber/commit/5c8ec2e))
