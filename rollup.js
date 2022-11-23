import crypto from 'crypto'
import recast from 'recast'
import astTypes from 'ast-types'
import util from '@rollup/pluginutils'
import acorn from 'acorn'

export default ({
  tags,
  output,
  include,
  exclude,
  algorithm = 'md5',
  dedent = true
}) => {
  const queries = {}
      , matchRegex = new RegExp('(' + [].concat(tags).join('|') + ')`')
      , filter = util.createFilter(include, exclude)

  return {
    transform: function(code, id) {
      if (!filter(id))
        return

      if (!code.match(matchRegex))
        return null

      const ast = recast.parse(code, {
        parser: {
          parse(source, opts) {
            return acorn.parse(source, {
              ...opts,
              ecmaVersion: 2022,
              sourceType: 'module'
            })
          }
        },
        sourceFileName: id
      })

      astTypes.visit(ast, {
        visitTaggedTemplateExpression(path) {
          const n = path.node

          if (!tags.includes(n.tag.name))
            return this.traverse(path)

          n.type = 'CallExpression'
          n.arguments = [
            {
              type: 'Literal',
              value: add(n.tag.name, n.quasi.quasis.map(x => x.value.cooked))
            },
            ...n.quasi.expressions
          ]
          n.callee = n.tag
          this.traverse(path)
        }
      })

      return recast.print(ast, { sourceMapName: 'map.json' })
    },
    buildEnd: () => output(queries)
  }

  function add(tag, query) {
    const hash = crypto.createHash(algorithm).update()
    const dedented = dedent(query)
    dedented.forEach(x => hash.update(x))
    const checksum = hash.digest('hex')
    tag in queries === false && (queries[tag] = {})
    queries[tag][checksum] = query
    return checksum
  }
}
