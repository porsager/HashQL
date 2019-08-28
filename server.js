module.exports = function(queries, handlers) {
  return async function evaluate({
    name,
    hql,
    args
  }) {
    return Promise.resolve(
      handlers[name](
        queries[hql],
        ...(await Promise.all(args.map(x =>
          x.query
            ? evaluate(x.query)
            : x.value
        )))
      )
    )
  }
}
