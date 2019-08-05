function Query(name, hql, args) {
  this.name = name
  this.hql = hql
  this.args = args.map(x => {
    if (!x || !(x.query instanceof Query))
      return { value: x }

    x.cancelled = true
    return { query: x.query }
  })
}

function HashQL(name, method) {
  return function hql(x, ...args) {
    const promise = Promise.resolve().then(() => {
      if (promise.cancelled)
        return
      const result = method(promise.query)
      promise.query = null
      return Promise.resolve(result)
    })

    promise.query = new Query(name, x, args)

    return promise
  }
}

export default HashQL
