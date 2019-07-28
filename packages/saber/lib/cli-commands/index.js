const commands = ['dev', 'build', 'serve', 'eject']

module.exports = function(cli) {
  commands.forEach(command => require(`./${command}`)(cli))
}
