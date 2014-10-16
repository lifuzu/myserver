var debug = require('debug')('myown');
var app = require('./app');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

io.on('connection', function(socket) {
  socket.emit('news', { hello: 'world'});
  socket.on('my other event', function(data) {
    console.log(data);
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});
