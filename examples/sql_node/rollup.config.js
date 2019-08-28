const hql = require('../../rollup.js')
const path = require('path')
const fs = require('fs')

module.exports = {
  input: 'src/index.js',
  plugins: [
    hql({
      tags: ['sql', 'node'],
      output: (x) => fs.writeFileSync(path.join(__dirname, './queries.json'), JSON.stringify(x, null, 2))
    })
  ],
  output: {
    file: 'dist/index.js',
    format: 'iife'
  }
}
