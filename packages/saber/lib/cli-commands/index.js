const commands = ['dev', 'build', 'serve', 'eject-theme']

module.exports = function(cli) {
  commands.forEach(command => require(`./${command}`)(cli))
}
