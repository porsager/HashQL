import http from 'http'
import ey from 'ey'
import bodyParser from 'body-parser'
import postgres from 'peegee'
import queries from './queries.json'
import HashQL from '../../server.js'

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
