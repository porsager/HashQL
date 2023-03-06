import fs from 'fs/promises'
import modify from './modify.js'

export default function({
  salt,
  tags,
  output,
  algorithm = 'md5',
  dedent: shouldDedent = true
}) {
  return {
    name: 'hashql',
    setup(build) {
      const queries = {}
          , matchRegex = new RegExp('(' + [].concat(tags).join('|') + ')`')

      build.onEnd(x => {
        x.errors.length || output(queries)
      })

      build.onLoad({ filter: /./ }, async(file) => {
        if (file.path.includes('node_modules'))
          return undefined

        const code = await fs.readFile(file.path, 'utf-8')
        if (!code.match(matchRegex))
          return undefined

        const modified = modify({
          shouldDedent,
          algorithm,
          queries,
          code,
          tags,
          salt,
          path: file.path
        })

        const { sourcesContent, ...map } = modified.map // eslint-disable-line

        return {
          contents: modified.code
            + '//# sourceMappingURL=data:application/json;base64,'
            + btoa(JSON.stringify(map))
        }
      })
    }
  }
}
