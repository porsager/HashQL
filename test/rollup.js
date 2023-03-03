import t from 'fantestic'

import url from 'url'
import HashQL from '../rollup.js'
import { rollup } from 'rollup'

t('Behaves', async() => {
  let queries

  const bundle = await rollup({
    input: url.fileURLToPath(new URL('sample/index.js', import.meta.url)),
    plugins: [
      HashQL({
        tags: ['sql', 'node'],
        output: x => queries = x
      })
    ]
  })

  const result = await bundle.generate({ format: 'esm', sourcemap: true })

  return [
    true,
    Object.keys(queries.sql).every(x => result.output[0].code.includes(x))
  ]
})
