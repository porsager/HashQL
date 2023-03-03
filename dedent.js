const indented = (xs) => xs.reduce(
  (min, x, i) => Math.min(min, (x.match(/^[\t ]*[^\t\n ]/gm) || []).reduce(
    (min, x, i) => x.length - 1 < min ? x.length - 1 : min,
    Infinity
  )),
  Infinity
)

export default function dedent(xs, ...args) {
  const min = indented(xs)
  xs[0] = xs[0].replace(/^[\r\n\t ]+/g, '')
  xs[xs.length - 1] = xs[xs.length - 1].replace(/[\r\n\t ]+$/g, '')
  const regexp = new RegExp('^' + ' '.repeat(min), 'gm')
  return xs.map((x, i) => x.replace(regexp, ''))
}
