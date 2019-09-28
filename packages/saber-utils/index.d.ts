declare module 'saber-utils' {
  import fs from 'fs-extra'
  import glob from 'fast-glob'

  const slash: (input: string) => string

  const isAbsoluteUrl: (input: string) => boolean

  export { fs, glob, slash, isAbsoluteUrl }
}
