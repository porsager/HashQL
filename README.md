# HashQL

> Chuck Norris can access the DB from the UI.

This implementation consists of 3 pieces.

- The Client module
- The Build module
- The Server module

# The Client

The client is very simple and is the one you'll be using the most. To set it up you define which backends you want, and it returns a tagged template function to use for the queries. This allows you to easily integrate with any transport (`fetch`, `WebSocket`, `XMLHttpRequest` or a 🐦).

```js
import HashQL from 'hashql'

const { sql } = HashQL('sql', query => 
  fetch('/hql', {
    method: 'POST',
    body: JSON.stringify(query)
  }).then(res => res.json())
)

await users = sql`select * from users`
```

# The Build module 

The job of the build module<sup>*</sup> is to replace all HashQL instances in the client code with their corresponding hashes, and to store the pair for lookup by the server (could be in a json file or database).  

```js
import HashQL from 'hashql/rollup'

rollup({
  ...,
  plugins: [
    HashQL({
      tags: ['sql'],
      output: queries => fs.writeFileSync(
        'hashql.json', 
        JSON.stringify(queries, null, 2)
      )
    })
  ]
})
```

> * Currently the build part is only available as a rollup plugin, but it should be fairly simple to support other bundlers or have it as a completely standalone module to run by itself. 

# The Server module

The Server Module handles the incoming queries and then calls the handler functions to do the actual query and return the result. This is fairly simple to implement with most libraries. Here is a sample with Node and [Postgres.js](https://github.com/porsager/postgres) requests

```js
import HashQL from 'hashql/server'
import postgres from 'postgres'

const sql = postgres({ ... })

const hql = HashQL(queries, {
  
  sql: (query, input, context) => 
    sql.call(null, query, ...input),
  
  node: (query, input, context) =>
    eval(query.slice(1).reduce(
      (acc, x, i) => acc + JSON.stringify(input[i]) + x, 
      query[0])
    )

})

app.post('/hashql', (req, res) => {
  hql(req.body, req.user)
    .then(x => res.end(x))
    .catch((err) => {
      res.statusCode = err.statusCode
      res.end(err.message)
    })
})
```
