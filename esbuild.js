import crypto from 'crypto'
import recast from 'recast'
import astTypes from 'ast-types'
import fs from 'fs/promises'
import acorn from 'acorn'

export default function({ tags, filter = /\.js/, output }) {
  return {
    name: 'hashql',
    setup(build) {
      const queries = {}
          , matchRegex = new RegExp('(' + [].concat(tags).join('|') + ')`')

      build.onLoad({ filter }, async(args) => {
        const code = await fs.readFile(args.path, 'utf-8')
        if (!code.match(matchRegex)) {
          return {
            contents: code
          }
        }

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
          sourceFileName: args.path
        })

        astTypes.visit(ast, {
          visitTaggedTemplateExpression(path) {
            const n = path.node

            if (!tags.includes(n.tag.name)) return this.traverse(path)

            n.type = 'CallExpression'
            n.arguments = [
              {
                type: 'Literal',
                value: add(
                  n.tag.name,
                  n.quasi.quasis.map((x) => x.value.cooked)
                )
              },
              ...n.quasi.expressions
            ]
            n.callee = n.tag
            this.traverse(path)
          }
        })

        output(queries)

        return {
          contents: recast.print(ast, { sourceMapName: 'map.json' }).code
        }
      })

      function add(tag, query) {
        const md5 = crypto.createHash('md5').update(query.join()).digest('hex')
        tag in queries === false && (queries[tag] = {})
        queries[tag][md5] = query
        return md5
      }
    }
  }
}
