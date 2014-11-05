var debug = require('debug')('myown');
var app = require('./app');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

var clients = {}
var numClients = 0
io.on('connection', function(socket) {
  var addedUser = false;

  socket.emit('news', { hello: 'world'});
  socket.on('my other event', function(data) {
    console.log(data);
  });
  // Support ionic clients
  socket.on('message:send', function(message){
    console.log(message)
    io.emit('message:received', message);
  });
  // Support ionic user joined message
  socket.on('user:joined', function(user) {
    var message = user.name + ' joined the room';
    io.emit('user:joined', {message: message, time: moment(), expires: moment().add(10) })
  });
  // When the client emits 'chat message', ...
  socket.on('chat message', function(message){
    console.log({
      username: socket.username,
      message: message
    })
    socket.broadcast.emit('chat message', {
      username: socket.username,
      message: message
    });
  });
  // When the client emits 'add user', ...
  socket.on('add user', function(user) {
    console.log(user);
    // Store the username in the socket session for this client
    socket.username = user.name
    // Add the client's username to the global list
    clients[user.name] = socket
    ++numClients
    addedUser = true
    io.emit('login', {numClients: numClients})
    // Echo globally that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numClients: numClients
    });
  })
  // When the client emits 'private message', ...
  socket.on('private message', function(msg) {
    fromMsg = {from: socket.username, txt: msg.txt}
    clients[msg.to].emit('private message', fromMsg)
  })
  // When the client emits 'typing', we broadcast to others
  socket.on('typing', function() {
    io.emits('typing', {
      username: socket.username
    })
  })
  // When the client emits 'stop typing', we broadcast to others
  socket.on('stop typing', function() {
    io.emits('stop typing', {
      username: socket.username
    })
  })
  // When the client emits 'disconnect', ...
  socket.on('disconnect', function() {
    // Remove the username from global usernames list
    if (addedUser) {
      delete clients[socket.username]
      --numClients
      // Echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numClients: numClients
      })
    }
  })
});
