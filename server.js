var debug = require('debug')('myown');
var app = require('./app');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

var clients = {}
io.on('connection', function(socket) {
	var userName;
  socket.emit('news', { hello: 'world'});
  socket.on('my other event', function(data) {
    console.log(data);
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('connection name', function(user) {
    userName = user.name
    clients[user.name] = socket
    io.emit('new user', user.name + " has joined.");
  })
  socket.on('private message', function(msg) {
    fromMsg = {from: userName, txt: msg.txt}
    clients[msg.to].emit('private message', fromMsg)
  })
  socket.on('disconnect', function() {
    delete clients[userName]
  })
});
