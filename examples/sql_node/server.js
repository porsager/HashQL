const http = require('http')
    , Pgp = require('pg-promise')
    , queries = require('./queries.json')
    , HQL = require('../../server.js')
    , cp = require('child_process')
    , m = require('pg-monitor')

const options = {}
const pgp = Pgp(options)
const db = pgp('postgres://localhost/beat')

const hql = HQL(queries, {
  sql: (xs, ...args) =>
    db.query(xs.slice(1).reduce((acc, x, i) => acc + '$' + (i + 1) + x, xs[0]), args)
  ,
  node: (xs, ...args) =>
    eval(xs.slice(1).reduce((acc, x, i) => acc + JSON.stringify(args[i]) + x, xs[0]))
})

const server = http.createServer((req, res) => {
  let body = ''

  if (req.method !== 'POST')
    return res.end('OK')

  req.on('data', x => body += x)
  req.on('end', async() => {
    try {
      body = JSON.parse(body)
    } catch (e) {
      res.statusCode = 500
      return res.end('Not valid JSON')
    }

    const result = await hql(body).catch(e => {
      res.statusCode = 500
      return e
    })

    res.end(JSON.stringify(result))
  })
})

server.listen(8000)
