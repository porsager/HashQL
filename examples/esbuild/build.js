const hashql = require('../../esbuild'),
  fs = require('fs')

require('esbuild').build({
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
