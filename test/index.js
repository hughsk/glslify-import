const glslify = require('glslify')
const path    = require('path')
const test    = require('tape')

const recursive = path.join(__dirname, 'fixtures', 'recursive-origin.glsl')
const basic = path.join(__dirname, 'fixtures', 'basic-origin.glsl')

test('glslify-import: basic', function(t) {
  glslify.bundle(basic, {
    transform: [ require.resolve('../index.js') ]
  }, function(err, src) {
    if (err) throw err

    t.ok(/\sunaltered\s/.exec(src), 'unaltered variable is unaltered')
    t.ok(/basicRequire/.exec(src), 'basic-require.glsl imported dependency is still included')
    t.end()
  })
})

test('glslify-import: recursive', function(t) {
  glslify.bundle(recursive, {
    transform: [ require.resolve('../index.js') ]
  }, function(err, src) {
    if (err) throw err

    t.ok(/\sunaltered\s/.exec(src), 'unaltered variable is unaltered')
    t.ok(/basicRequire/.exec(src), 'basic-require.glsl imported dependency is still included')
    t.ok(!/\#pragma glslify/.exec(src), 'no pragmas remaining')
    t.equal(src.match(/main\(\)/g).length, 2, '2 copies imported')
    t.equal(src.match(/\#define GLSLIFY/).length, 1, 'only 1 glslify definition')
    t.end()
  })
})
