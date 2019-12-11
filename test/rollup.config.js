const hashql = require('../rollup.js')

module.exports = {
  input: './client.js',
  output: {
    file: 'test.js',
    format: 'esm'
  },
  plugins: [
    hashql({
      tags: ['sql', 'node'],
      output: console.log
    })
  ]
}
