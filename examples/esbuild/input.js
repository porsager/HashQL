const log = require('./othermodule')

function sql(strings, ...args) {
  log(strings)
  return 'Dummy'
}

const value = 'something'
sql`
  select * from table where column = ${value}
  order by othercolumn
`
