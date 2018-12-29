const methodNames = ['none', 'one', 'many', 'any', 'oneOrNone']

export default ({
  request
}) => {
  const methods = methodNames.reduce((acc, method) => (
    acc[method] = (sql, input) => ({
      method,
      sql,
      input
    }),
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

export const sql = function(string) {
  if (arguments.length > 1)
    throw new Error('HashQL does not support dynamic variables')

  if (!Array.isArray(string) || typeof string[0] !== 'string')
    throw new Error('You have to call sql as a template string — sql``')

  return string[0]
}
