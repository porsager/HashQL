import crypto from 'crypto'

import recast from 'recast'
import { parse } from 'acorn'
import astTypes from 'ast-types'
import dedent from './dedent.js'

const cwd = process.cwd()
const hashIt = (x, algorithm) => crypto.createHash(algorithm).update(x).digest('hex')

export default function({
  shouldDedent,
  algorithm,
  queries,
  code,
  tags,
  path
}) {
  const ast = recast.parse(code, {
    parser: {
      parse(source, opts) {
        return parse(source, {
          ...opts,
          ecmaVersion: 'latest',
          sourceType: 'module'
        })
      }
    },
    sourceFileName: path
  })

  astTypes.visit(ast, {
    visitTaggedTemplateExpression(x) {
      const n = x.node
      if (!tags.includes(n.tag.name))
        return this.traverse(x)

      const query = n.quasi.quasis.map((x) => x.value.cooked)
      const dedented = shouldDedent ? dedent(query) : query
      const checksum = hashIt(dedented.map(x => hashIt(x, algorithm)).join(''), algorithm)
      n.tag.name in queries === false && (queries[n.tag.name] = {})
      queries[n.tag.name][checksum] = Object.assign(dedented, {
        file: path.replace(cwd, ''),
        line: n.loc.start.line,
        column: n.loc.start.column
      })

      n.type = 'CallExpression'
      n.arguments = [
        {
          type: 'Literal',
          value: checksum
        },
        ...n.quasi.expressions
      ]
      n.callee = n.tag
      this.traverse(x)
    }
  })

  return recast.print(ast, { sourceMapName: 'map.json' })
}

