const crypto = require('crypto')
    , recast = require('recast')
    , astTypes = require('ast-types')
    , util = require('@rollup/pluginutils')

module.exports = ({
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
            return require('acorn').parse(source, {
              ...opts,
              ecmaVersion: 2020,
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
              value: add(n.quasi.quasis.map(x => x.value.cooked))
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

  function add(s) {
    const md5 = crypto
      .createHash('md5')
      .update(s.join())
      .digest('hex')

    queries[md5] = s

    return md5
  }
}
