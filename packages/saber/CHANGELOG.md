# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
