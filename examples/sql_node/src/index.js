import HQL from '../../../client.js'

const pre = document.createElement('pre')

const ui = {}

ui.name = document.body.appendChild(
  Object.assign(document.createElement('input'), {
    oninput: search
  })
)

ui.columns = document.body.appendChild(
  Object.assign(document.createElement('input'), {
    value: 'name',
    oninput: search
  })
)

document.body.appendChild(pre)

const { sql, node } = HQL(['sql', 'node'], ({
  tag,
  hash,
  input
}) => {
  return fetch('http://localhost:8000', {
    method: 'POST',
    headers: {
      'Content-Type': 'JSON'
    },
    body: JSON.stringify({ tag, hash, input })
  }).then(r => r.json())
})

function search() {
  sql`
    select
      ${ ui.columns.value.split(',') }:name
    from countries
    where name like ${ node`
      const name = ${ ui.name.value }
      if (!name.match(/^[a-z]+$/i))
        throw 'Enter name to search for - node: ' + process.version
      name + '%'
    `}
  `.then(x => { pre.textContent = JSON.stringify(x, null, 2) })
}
