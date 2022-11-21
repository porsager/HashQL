import crypto from 'crypto'
import recast from 'recast'
import astTypes from 'ast-types'
import util from '@rollup/pluginutils'
import acorn from 'acorn'

export default ({
  tags,
  output,
  include,
  exclude
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
    const md5 = crypto
      .createHash('md5')
      .update(query.join())
      .digest('hex')

    tag in queries === false && (queries[tag] = {})
    queries[tag][md5] = query

    return md5
  }
}
