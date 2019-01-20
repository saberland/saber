import sum from '../src/sum'
import style from './hehe.module.css'

export default {
  render(h) {
    return h(
      'h1',
      { class: style.title },
      ['lorem ', sum(1, 2)]
    )
  }
}

export const attributes = {
  title: 'Flat oppai',
  layout: 'foo'
}
