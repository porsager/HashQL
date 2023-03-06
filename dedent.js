const indented = (xs) => xs.reduce(
  (min, x, i) => Math.min(
    min,
    (x.match(/\n[\t ]*[^\t\n ]/g) || []).reduce(
      (min, x, i) => x.length - 2 <= min ? x.length - 2 : min,
      Infinity
    )
  ),
  Infinity
) | 0

export default function dedent(xs, ...args) {
  const min = indented(xs)
  xs[0] = xs[0].replace(/^[\r\n\t ]+/g, '')
  xs[xs.length - 1] = xs[xs.length - 1].replace(/[\r\n\t ]+$/g, '')
  const regexp = new RegExp('\n' + ' '.repeat(min), 'g')
  return xs.map((x, i) => x.replace(regexp, '\n'))
}
