const http = require('http')
    , ey = require('ey')
    , bodyParser = require('body-parser')
    , postgres = require('peegee')
    , queries = require('./queries.json')
    , HashQL = require('../../server.js')

const sql = postgres('postgres://localhost/beat')

const hql = HashQL(queries, {
  sql: (query, input, context) =>
    sql.unsafe(query.slice(1).reduce((acc, x, i) => acc + '$' + (i + 1) + x, query[0]), input)
  ,
  node: (query, input, context) =>
    eval(query.slice(1).reduce((acc, x, i) => acc + JSON.stringify(input[i]) + x, query[0]))
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
