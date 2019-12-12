module.exports = function(queries, handlers) {
  return async function evaluate({ tag, hash, input }) {
    const query = typeof queries === 'function' ? queries(hash) : queries[hash]
    if (!query)
      throw Object.assign(new Error(hash + ' not found for ' + tag), { code: 'NOT_FOUND', status: 404 })

    return Promise.resolve(
      handlers[tag](
        query,
        ...(await Promise.all(input.map(x =>
          x.query
            ? evaluate(x.query)
            : x.value
        )))
      )
    )
  }
}
