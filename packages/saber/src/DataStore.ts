import { Saber } from "."

export type DataFactory = (options: any, context: Saber) => any

export class DataStore {
  store: Map<string, { factory: DataFactory }> = new Map()

  addData(name: string, factory: DataFactory) {
    this.store.set(name, {
      factory
    })
  }

  removeData(name: string) {
    this.store.delete(name)
  }

  hasData(name: string) {
    return this.store.has(name)
  }

  getData(name: string) {
    return this.store.get(name)
  }
}
