const methodNames = ['none', 'one', 'many', 'any', 'oneOrNone']
    , isMD5 = /^[0-9a-f]{32}$/i

export default ({
  request
}) => {
  const methods = methodNames.reduce((acc, method) => (
    acc[method] = (sql, input) => {
      if (!Array.isArray(sql) && !isMD5.test(sql))
        throw new Error('Expected sql`` or MD5 hash')

      return {
        method,
        sql: sql[0],
        input
      }
    },
    acc
  ), {})

  return Object.assign({
    tx: (fn) => request(fn(methods))
  },
    Object.keys(methods).reduce((acc, m) => (
      acc[m] = (...args) => request(methods[m](...args)),
      acc
    ), {})
  )
}

export const sql = function(raw) {
  if (arguments.length > 1)
    throw new Error('HashQL does not support dynamic variables')

  if (!Array.isArray(raw) || typeof raw[0] !== 'string')
    throw new Error('You have to call sql as a template string — sql``')

  return raw
}
