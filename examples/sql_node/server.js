const http = require('http')
    , ey = require('ey')
    , bodyParser = require('body-parser')
    , postgres = require('peegee')
    , queries = require('./queries.json')
    , HashQL = require('../../server.js')

const sql = postgres('postgres://localhost/beat')

const hql = HashQL(queries, {
  sql: (xs, ...args) =>
    sql.unsafe(xs.slice(1).reduce((acc, x, i) => acc + '$' + (i + 1) + x, xs[0]), args)
  ,
  node: (xs, ...args) =>
    eval(xs.slice(1).reduce((acc, x, i) => acc + JSON.stringify(args[i]) + x, xs[0]))
})

const app = ey()

app.post(bodyParser.json(), (req, res, next) => {
  hql(req.body)
  .catch(err => {
    res.statusCode = 500
    return { error: err }
  })
  .then(x => {
    res.end(JSON.stringify(x))
  })
})

http.createServer(app).listen(8000)
