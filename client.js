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
