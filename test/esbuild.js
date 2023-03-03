import t from 'fantestic'
import url from 'url'

import HashQL from '../esbuild.js'
import esbuild from 'esbuild'

t('Does the needful', async() => {
  let queries

  const result = await esbuild.build({
    entryPoints: [url.fileURLToPath(new URL('sample/index.js', import.meta.url))],
    bundle: true,
    write: false,
    plugins: [
      HashQL({
        tags: ['sql', 'node'],
        output: x => queries = x
      })
    ]
  })

  return [
    true,
    Object.keys(queries.sql).every(x => result.outputFiles[0].text.includes(x))
  ]
})
