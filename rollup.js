const modify = require('rollup-plugin-modify')
    , crypto = require('crypto')

const md5 = s => crypto
  .createHmac('md5', 'wat')
  .update(s)
  .digest('hex')

module.exports = ({
  output
}) => {
  const queries = {}

  return Object.assign(modify({
    find: /sql`([\s\S]*?)`/,
    replace: (_, sql) => {
      const query = sql.trim().split('\n').map(x => x.trim()).filter(x => x).join(' ')
      const hash = md5(query)
      queries[hash] = query
      return '"' + hash + '"'
    }
  }), {
    generateBundle: () => output(queries)
  })
}
