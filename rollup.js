const modify = require('rollup-plugin-modify')
    , crypto = require('crypto')

const md5 = s => crypto
  .createHash('md5')
  .update(s)
  .digest('hex')

module.exports = ({
  output
}) => {
  const queries = {}

  return Object.assign(modify({
    find: /sql`([\s\S]*?)`/,
    replace: (_, sql) => {
      if (!sql)
        return _

      const hash = md5(sql)
      queries[hash] = sql
      return '"' + hash + '"'
    }
  }), {
    generateBundle: () => output(queries)
  })
}
