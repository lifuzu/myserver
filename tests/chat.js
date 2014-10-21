var should = require('should')
var io = require('socket.io-client')

var url = 'http://localhost:3000'

var options = {
  transports: ['websocket'],
  'force new connection': true
}

var chatUser1 = {'name': 'Tom'}
var chatUser2 = {'name': 'Sally'}
var chatUser3 = {'name': 'Dana'}

var chat = describe('Chat Server', function(){
  it('Should broadcast new user to all other users', function(done) {
   var client1 = io.connect(url, options)
    client1.on('connect', function(data) {
      client1.emit('add user', chatUser1)
      var client2 = io.connect(url, options);
      client2.on('connect', function(data) {
        client2.emit('add user', chatUser2)
      })
      client1.on('user joined', function(data) {
        data.username.should.equal(chatUser2.name)
        client2.disconnect()
        client1.disconnect()
        done()
      })
    })

    // var numUsers = 0
    // client1.on('user joined', function(data) {
    //   numUsers += 1
    //   if (numUsers === 2) {
    //     data.username.should.equal(chatUser2.name)
    //     client1.disconnect()
    //     done()
    //   }
    // })
  })

  it('Should be able to broadcast messages', function(done) {
    var client1, client2, client3
    var message = 'Hello World'
    var messages = 0

    var checkMessage = function(client) {
      client.on('chat message', function(msg) {
        message.should.equal(msg.message)
        client.disconnect()
        messages++
        if (messages === 2) { done() }
      })
    }

    client1 = io.connect(url, options)
    checkMessage(client1)

    client1.on('connect', function(data) {
      client2 = io.connect(url, options)
      checkMessage(client2)
      client2.on('connect', function(data) {
        client3 = io.connect(url, options)
        checkMessage(client3)

        client3.on('connect', function(data) {
          client2.emit('chat message', message)
        })
      })
    })
  })

  it('Should be able to send private messages', function(done) {
    var client1, client2, client3
    var message = { to: chatUser1.name, txt: 'Private Hello World'}
    var messages = 0

    var completeTest = function() {
      messages.should.equal(1)
      client1.disconnect()
      client2.disconnect()
      client3.disconnect()
      done()
    }

    var checkPrivateMessage = function(client) {
      client.on('private message', function(msg) {
        message.txt.should.equal(msg.txt)
        msg.from.should.equal(chatUser3.name)
        messages++
        if (client === client1 ) { setTimeout(completeTest, 40) }
      })
    }

    client1 = io.connect(url, options)
    checkPrivateMessage(client1)

    client1.on('connect', function(data) {
      client1.emit('add user', chatUser1)
      client2 = io.connect(url, options)
      checkPrivateMessage(client2)

      client2.on('connect', function(data) {
        client2.emit('add user', chatUser2)
        client3 = io.connect(url, options)
        checkPrivateMessage(client3)

        client3.on('connect', function(data) {
          client3.emit('add user', chatUser3)
          client3.emit('private message', message)
        })
      })
    })
  })
})

module.exports = chat