const first = xs => xs[1]
    , rest = xs => xs.slice(1)
    , exec = (db, q) => db[q.method](q.sql, q.input)

module.exports = ({
  query = null,
  db,
  pre = null,
  onerror
}) => {
  return pre
    ? withPre
    : withoutPre

  function withPre(data, ctx) {
    const queries = [].concat(data)
    return Promise.all(queries.map(query))
      .then(xs => xs.map((sql, i) => ({ ...queries[i], sql })))
      .then(xs =>
        db.tx(t =>
          t.batch(
            [pre(t, ctx)].concat(
              xs.map(q => exec(t, q))
            )
          )
        )
        .then(Array.isArray(data) ? rest : first)
        .catch(err => {
          throw onerror ? onerror(err) : err
        })
      )
  }

  function withoutPre(data) {
    const queries = [].concat(data)
    return Promise.all(queries.map(query))
      .then(xs => xs.map((sql, i) => ({ ...queries[i], sql })))
      .then(xs =>
        Array.isArray(data)
          ? db.tx(t => t.batch(xs.map(q => exec(t, q))))
          : exec(db, xs[0])
      )
  }
}
