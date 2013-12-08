/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
var users={};
var clients={};
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('join chat', function (data) {
     if(users[data['name']] === undefined){
         users[data['name']] = socket.id;
         clients[socket.id]=data['name'];
         io.sockets.emit('join chat res',{msg:'New User '+data['name']+' Joined',user:data['name']});
         io.sockets.emit('users',JSON.stringify(Object.keys(users)));
     }else{
         socket.emit('duplicate user',{msg:'User Already Existed'});
     }
 });
 socket.on('post msg', function (data) {
      var target=data['target'],
          from=data['from'];
      if(target == 'All'){
        io.sockets.emit('post msg res',{status:true,msg:data['msg'],target:target,from:from});          
      }else{
          io.sockets.sockets[users[target]].emit('post msg res',{status:true,msg:data['msg'],target:target,from:from});
      }
      
      //socket.emit('post msg res',{status:true,msg:data['msg']});
  });
  
  
        
});



