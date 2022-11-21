import hql from '../../rollup.js'
import path from 'path'
import fs from 'fs'

export default {
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
