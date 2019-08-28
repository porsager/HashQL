const hashql = require('../rollup.js')
    , rollup = require('rollup')

rollup.rollup({
  input: './test/client.js',
  plugins: [
    hashql({
      tags: ['sql', 'node'],
      output: console.log
    })
  ]
})
.then(x => x.generate({ format: 'esm' }))
.then(x => console.log(x.output[0].code))
