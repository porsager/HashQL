import t from 'fantestic'
import HashQL from '../index.js'

t('Is a good boy', async() => {
  const xs = []
  const { sql, node } = HashQL(
    ['sql', 'node'],
    x => xs.push(x)
  )

  await sql('a', [1, 2])
  await node('b', [3, 4])

  return [
    '[{"tag":"sql","hash":"a","input":[{"value":[1,2]}]},{"tag":"node","hash":"b","input":[{"value":[3,4]}]}]',
    JSON.stringify(xs)
  ]
})

