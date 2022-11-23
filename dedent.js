export default function dedent(xs) {
  const min = xs.reduce(
    (min, x, i) => Math.min(min, (x.match(/^[\t ]*[^\t\n ]/gm) || []).reduce(
      (min, x, i) => x.length - 1 < min ? x.length - 1 : min,
      Infinity
    )),
    Infinity
  )
  const regexp = new RegExp('^' + ' '.repeat(min), 'gm')
  return xs.map(x => x.replace(regexp, ''))
}
