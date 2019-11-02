const resolvePackage = require('../resolvePackage')

test('resolvePackage', () => {
  expect(resolvePackage('foo', { cwd: false })).toBe('foo')
  expect(resolvePackage('@foo/bar', { cwd: false })).toBe('@foo/bar')
  expect(resolvePackage('foo', { prefix: 'prefix-', cwd: false })).toBe(
    'prefix-foo'
  )
  expect(resolvePackage('prefix-foo', { prefix: 'prefix-', cwd: false })).toBe(
    'prefix-foo'
  )
  expect(resolvePackage('@foo/bar', { prefix: 'prefix-', cwd: false })).toBe(
    '@foo/prefix-bar'
  )
  expect(
    resolvePackage('@foo/prefix-bar', { prefix: 'prefix-', cwd: false })
  ).toBe('@foo/prefix-bar')
})
