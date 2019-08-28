const crypto = require('crypto')
    , recast = require('recast')
    , astTypes = require('ast-types')

module.exports = ({
  tags,
  output
}) => {
  const queries = {}
      , matchRegex = new RegExp('(' + [].concat(tags).join('|') + ')`', 'g')

  return {
    transform: function(code, id) {
      if (!matchRegex.test(code))
        return null

      const ast = this.parse(code)
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
      return { code: recast.print(ast).code }
    },
    generateBundle: () => output(queries)
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
