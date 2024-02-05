import dedent from './dedent.js'

HashQL.dev = Symbol('dev')

export default function HashQL(queries, handlers) {
  const get = typeof queries === 'function'
    ? queries
    : queries === HashQL.dev
    ? ({ hash }) => dedent(hash)
    : ({ hash, tag }) => queries[tag] && queries[tag][hash]

  return async function evaluate(x, context) {
    let ended
    let query = get(x, context, fn => ended = fn)
    query && typeof query.then === 'function' && (query = await query)

    if (!query)
      throw Object.assign(new Error(x.hash + ' not found for ' + x.tag), { code: 'NOT_FOUND', status: 404 })

    return Promise.resolve(
      handlers[x.tag](
        Object.assign(query, { raw: query }),
        await Promise.all(x.input.map(x =>
          x.query
            ? evaluate(x.query, context)
            : x.value
        )),
        context
      )
    ).then(
      result => (ended && ended(null, result), result),
      error => {
        ended && ended(error)
        throw error
      }
    )
  }
}
