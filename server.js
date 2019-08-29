module.exports = function(queries, handlers) {
  return async function evaluate({ tag, hash, input }) {
    return Promise.resolve(
      handlers[tag](
        typeof queries === 'function' ? queries(hash) : queries[hash],
        ...(await Promise.all(input.map(x =>
          x.query
            ? evaluate(x.query)
            : x.value
        )))
      )
    )
  }
}
