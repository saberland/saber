declare module 'saber-utils' {
  import fs from 'fs-extra'
  import glob from 'fast-glob'

  type Slash = (input: string) => string

  const slash: Slash

  export { fs, glob, slash }
}
