module.exports = function(queries, handlers) {
  return async function evaluate(...xs) {
    const { name, hql, args } = xs.pop()
    return Promise.resolve(
      handlers[name].apply(handlers[name], xs.concat([
        typeof queries === 'function' ? queries(hql) : queries[hql],
        ...(await Promise.all(args.map(x =>
          x.query
            ? evaluate(x.query)
            : x.value
        )))
      ]))
    )
  }
}
