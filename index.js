function Query(tag, hash, input) {
  this.tag = tag
  this.hash = hash
  this.input = input.map(x => {
    if (!x || !(x.query instanceof Query))
      return { value: x }

    x.cancelled = true
    return { query: x.query }
  })
}

function HashQL(tags, handler) {
  return [].concat(tags).reduce((acc, tag) => ({
    ...acc,
    [tag]: function(hash, ...input) {
      const promise = Promise.resolve().then(() => {
        if (promise.cancelled)
          return
        const result = handler(promise.query)
        promise.query = null
        return Promise.resolve(result)
      })

      promise.query = new Query(tag, hash, input)

      return promise
    }
  }), {})
}

export default HashQL
