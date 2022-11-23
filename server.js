import dedent from './dedent.js'

export default function(queries, options, handlers) {
  arguments.length === 2 && (handlers = options, options = {})
  const get = typeof queries === 'function'
    ? x => queries(options.dedent === false ? x : dedent(x))
    : (hash, tag) => queries[tag] && queries[tag][hash]

  return async function evaluate({ tag, hash, input }, context) {
    const query = await get(hash, tag)

    if (!query)
      throw Object.assign(new Error(hash + ' not found for ' + tag), { code: 'NOT_FOUND', status: 404 })

    return Promise.resolve(
      handlers[tag](
        Object.assign(query, { raw: query }),
        await Promise.all(input.map(x =>
          x.query
            ? evaluate(x.query)
            : x.value
        )),
        context
      )
    )
  }
}
