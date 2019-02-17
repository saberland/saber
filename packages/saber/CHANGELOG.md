# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
