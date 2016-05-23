
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  // res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});



// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// })

// io.on('connection', function(socket){
// 	console.log("back in index file");
//   socket.on('chat message', function(msg){
//   		console.log("donno wat to do");
//     console.log('message: ' + msg);
//   });
// });

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(1337, function(){
  console.log('listening on *:1337');
});
