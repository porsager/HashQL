import util from '@rollup/pluginutils'
import modify from './modify.js'

export default function({
  salt,
  tags,
  output,
  algorithm = 'md5',
  dedent: shouldDedent = true
}) {
  const queries = {}
      , matchRegex = new RegExp('(' + [].concat(tags).join('|') + ')`')
      , filter = util.createFilter(null, 'node_modules')

  return {
    transform: function(code, path, x, b) {
      if (!filter(path))
        return

      if (!code.match(matchRegex))
        return null

      return modify({
        shouldDedent,
        algorithm,
        queries,
        code,
        tags,
        salt,
        path
      })
    },
    buildEnd: () => output(queries)
  }
}
