const hashql = require('../rollup.js')
    , rollup = require('rollup')
    , sourceMap = require('source-map')

rollup.rollup({
  input: './test/client.js',
  plugins: [
    hashql({
      tags: ['sql', 'node'],
      output: console.log
    })
  ]
})
.then(x => x.generate({ format: 'esm', sourcemap: true }))
.then(x => {
  const result = x.output[0]
      , SourceMapConsumer = sourceMap.SourceMapConsumer
      , smc = new SourceMapConsumer(result.map)

  const orig = smc.originalPositionFor({
    line: 8,
    column: 5
  })
})
