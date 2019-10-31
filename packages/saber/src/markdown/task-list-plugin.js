module.exports = function(md, options) {
  options = Object.assign(
    {
      disabled: true,
      divWrap: false,
      divClass: 'checkbox',
      idPrefix: 'cbx_',
      ulClass: 'task-list',
      liClass: 'task-list-item'
    },
    options
  )
  md.core.ruler.after('inline', 'github-task-lists', state => {
    const { tokens } = state
    let lastId = 0
    for (let i = 2; i < tokens.length; i++) {
      if (isTodoItem(tokens, i)) {
        todoify(tokens[i], lastId, options, state.Token)
        lastId += 1
        attrSet(tokens[i - 2], 'class', options.liClass)
        attrSet(tokens[parentToken(tokens, i - 2)], 'class', options.ulClass)
      }
    }
  })
}

function attrSet(token, name, value) {
  const index = token.attrIndex(name)
  const attr = [name, value]

  if (index < 0) {
    token.attrPush(attr)
  } else {
    token.attrs[index] = attr
  }
}

function parentToken(tokens, index) {
  const targetLevel = tokens[index].level - 1
  for (let i = index - 1; i >= 0; i--) {
    if (tokens[i].level === targetLevel) {
      return i
    }
  }

  return -1
}

function isTodoItem(tokens, index) {
  return (
    isInline(tokens[index]) &&
    isParagraph(tokens[index - 1]) &&
    isListItem(tokens[index - 2]) &&
    startsWithTodoMarkdown(tokens[index])
  )
}

function todoify(token, lastId, options, TokenConstructor) {
  const id = options.idPrefix + lastId
  token.children[0].content = token.children[0].content.slice(3)
  // label
  token.children.unshift(beginLabel(id, TokenConstructor))
  token.children.push(endLabel(TokenConstructor))
  // checkbox
  token.children.unshift(makeCheckbox(token, id, options, TokenConstructor))
  if (options.divWrap) {
    token.children.unshift(beginWrap(options, TokenConstructor))
    token.children.push(endWrap(TokenConstructor))
  }
}

function makeCheckbox(token, id, options, TokenConstructor) {
  const checkbox = new TokenConstructor('checkbox_input', 'input', 0)
  checkbox.attrs = [['type', 'checkbox'], ['id', id]]
  const checked = /^\[[xX]\][ \u00A0]/.test(token.content) // if token.content starts with '[x] ' or '[X] '
  if (checked === true) {
    checkbox.attrs.push(['checked', 'true'])
  }

  if (options.disabled === true) {
    checkbox.attrs.push(['disabled', 'true'])
  }

  return checkbox
}

function beginLabel(id, TokenConstructor) {
  const label = new TokenConstructor('label_open', 'label', 1)
  label.attrs = [['for', id]]
  return label
}

function endLabel(TokenConstructor) {
  return new TokenConstructor('label_close', 'label', -1)
}

// these next two functions are kind of hacky; probably should really be a
// true block-level token with .tag=='label'
function beginWrap(options, TokenConstructor) {
  const token = new TokenConstructor('checkbox_open', 'div', 0)
  token.attrs = [['class', options.divClass]]
  return token
}

function endWrap(TokenConstructor) {
  const token = new TokenConstructor('checkbox_close', 'div', -1)
  // token.content = '</label>';
  return token
}

function isInline(token) {
  return token.type === 'inline'
}

function isParagraph(token) {
  return token.type === 'paragraph_open'
}

function isListItem(token) {
  return token.type === 'list_item_open'
}

function startsWithTodoMarkdown(token) {
  // The leading whitespace in a list item (token.content) is already trimmed off by markdown-it.
  // The regex below checks for '[ ] ' or '[x] ' or '[X] ' at the start of the string token.content,
  // where the space is either a normal space or a non-breaking space (character 160 = \u00A0).
  return /^\[[xX \u00A0]\][ \u00A0]/.test(token.content)
}
