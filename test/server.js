import t from 'fantestic'
import HashQL from '../server.js'

t('Plays nice', async() => {
  const hql = HashQL({ sql: { a: ['yo'] }, node: { b: ['no'] } }, {
    sql: (xs, input) => xs,
    node: (xs, input) => xs
  }
  )

  return [
    'yono',
    [
      await hql({ tag: 'sql', hash: 'a', input: [1, 2] }),
      await hql({ tag: 'node', hash: 'b', input: [1, 2] })
    ].join('')
  ]
})
