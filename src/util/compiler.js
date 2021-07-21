/**
 *
 * Props to James Kyle for his lecture
 * about writing a compiler in JavaScript
 *
 * @link https://www.youtube.com/watch?v=Tar4WgAfMr4 James Kyle's GitHub
 * @link https://www.youtube.com/watch?v=Tar4WgAfMr4 Lecture
 *
 */

function tokenizer(input) {
  let current = 0
  const tokens = []

  while (current < input.length) {
    let char = input[current]

    if (char === '(') {
      tokens.push({
        type: 'parenthesis',
        value: '(',
      })
      current++
      continue
    }

    if (char === ')') {
      tokens.push({
        type: 'parenthesis',
        value: ')',
      })
      current++
      continue
    }

    const WHITESPACE = /\s/

    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    const NUMBERS = /[\d]/
    if (NUMBERS.test(char)) {
      let value = ''

      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({
        type: 'number',
        value,
      })

      continue
    }

    const LETTERS = /[\w]/
    if (LETTERS.test(char)) {
      let value = ''

      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({
        type: 'name',
        value,
      })

      continue
    }

    throw new TypeError(`Unknown character: ${char}`)
  }

  return tokens
}

function parser(tokens) {
  let current = 0

  const walk = () => {
    let { type, value } = tokens[current]

    if (type === 'number') {
      current++

      return {
        type: 'NumberLiteral',
        value,
      }
    }

    if (type === 'parenthesis' && value === '(') {
      let { value } = tokens[++current]

      const node = {
        type: 'CallExpression',
        name: value,
        params: [],
      }

      let token = tokens[++current]

      while (token.type !== 'parenthesis' || token.value !== ')') {
        node.params.push(walk())
        token = tokens[current]
      }

      current++

      return node
    }

    throw new TypeError(`Unknown token type: ${type}`)
  }

  const ast = {
    type: 'Program',
    body: [],
  }

  while (current < tokens.length) {
    ast.body.push(walk())
  }

  return ast
}

function traverser(ast, visitor) {
  const traverseArray = (array, parent) => {
    array.forEach(child => {
      traverseNode(child, parent)
    })
  }

  const traverseNode = (node, parent) => {
    let method = visitor[node.type]

    if (method) {
      method(node, parent)
    }

    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node)
        break
      case 'CallExpression':
        traverseArray(node.params, node)
        break
      case 'NumberLiteral':
        break
      default:
        throw new TypeError(`Unknown token type: ${node.type}`)
    }
  }

  traverseNode(ast, null)
}

function transformer(ast) {
  let newAst = {
    type: 'Program',
    body: [],
  }

  ast._context = newAst.body

  traverser(ast, {
    NumberLiteral: (node, parent) => {
      parent._context.push({
        type: 'NumberLiteral',
        value: node.value,
      })
    },
    CallExpression: (node, parent) => {
      let expression

      expression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: node.name,
        },
        arguments: [],
      }

      node._context = expression.arguments

      if (parent.type !== 'CallExpression') {
        expression = {
          type: 'ExpressionStatement',
          expression,
        }
      }

      parent._context.push(expression)
    },
  })

  return newAst
}

function codeGenerator(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGenerator).join('\n')
    case 'ExpressionStatement':
      return `${codeGenerator(node.expression)}`
    case 'CallExpression':
      return `${codeGenerator(node.callee)}(${node.arguments
        .map(codeGenerator)
        .join(', ')})`
    case 'Identifier':
      return node.name
    case 'NumberLiteral':
      return node.value
    default:
      throw new TypeError(`Unknown node type: ${node.type}`)
  }
}

export default function compiler(input) {
  const tokens = tokenizer(input)
  const ast = parser(tokens)
  const newAst = transformer(ast)
  const output = codeGenerator(newAst)

  return [output, newAst]
}
