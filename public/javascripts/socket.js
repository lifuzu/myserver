var socket = io();
socket.on('news', function(data) {
  console.log(data);
  socket.emit('my other event', { my: 'data'});
});
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat message', function(d) {
  $('#messages').append($('<li>').text(d.msg));
});