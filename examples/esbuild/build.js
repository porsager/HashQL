import hashql from '../../esbuild'
import fs from 'fs'
import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['input.js'],
  bundle: true,
  outfile: 'output.js',
  plugins: [
    hashql({
      tags: ['sql'],
      output: (queries) => {
        fs.writeFileSync('queries.json', JSON.stringify(queries, null, 2), 'utf-8')
      }
    })
  ]
})
