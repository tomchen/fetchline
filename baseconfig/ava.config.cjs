module.exports = {
  files: ['test/**/*.test.node.ts', 'test/**/*.test.node.js'],
  extensions: ['ts', 'js'],
  require: ['ts-node/register'],
  timeout: '2m',
}
