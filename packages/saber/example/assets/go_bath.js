var I = new Person()
var She = new Person()

const chat = require('chat')

chat
  .call(I, She, 'Hi')
  .on('response', (err, result) => {
    assert.equal(result, 'I went to bathroom')
  })
