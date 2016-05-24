var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb').MongoClient;
var port=process.env.PORT || 1337;
app.use(express.static(__dirname));

app.get('/', function(req, res){
  // res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});

// mongo.connect('mongodb://127.0.0.1/chat',function(err,db)
mongo.connect('mongodb://sindhura:sindhura@ds011863.mlab.com:11863/chatserver',function(err,db)
{
if(err) throw err;
io.on('connection', function(socket){
  console.log('a user connected');
var col=db.collection('messages');
sendStatus = function(s){
socket.emit('status', s);
};

  
//emit messages as output
col.find().limit(100).sort({_id: 1}).toArray(function(err, res){
if(err) throw err;
socket.emit('output', res);
});
//wait for input here
  socket.on('input message', function(data){
   //  io.emit('input message', data);
   //     console.log('name: ' + data.name);
   // console.log('message: ' + data.message);
  var name = data.name,
  message = data.message,
  whitespacePattern = /^\s*$/;

if(whitespacePattern.test(name) || whitespacePattern.test(message))
{
//console.log("invalid data");
sendStatus('Name and message required');
}
else
{

  col.insert({name: name, message: message}, function(){
  //console.log('inserted');
  //emit latest mesage to chat window
  io.emit('output', [data]);

  sendStatus({
message: 'message sent',
clear: true
  });
});
}

  });

})

});



http.listen(port, function(){
  console.log('listening on *:1337');
});


// app.listen(port);
// console.log('listening to port' +port);
