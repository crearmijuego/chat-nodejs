var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

//server.listen(process.env.PORT,process.env.IP);
server.listen(8000);
console.log('server started 8000');
app.use(express.static(__dirname +'/js'));
app.use(express.static(__dirname +'/css'));
app.use(express.static(__dirname +'/materialize'));
app.get("/",function(req,res){
    res.sendfile(__dirname +'/index.html');
});

var users = {};
var messages = [];
var history = 2;

io.sockets.on('connection', function(socket){ 
    console.log("connection made");
     var me = false;   
    for(var k in users){
        socket.emit('newusr',users[k]);
    }

    for(var k in messages){
        socket.emit('newmsg',messages[k]);
    }    
    
    socket.on('newmsg',function(message){
        message.user = me;
        date = new Date();
        message.h = date.getHours();
        message.m = date.getMinutes();
        messages.push(message);
        if(messages.length > history){
            messages.shift();
        }
        io.sockets.emit('newmsg', message);
    });
    
    socket.on('login', function(user){
        me = user;
        me.id = user.mail.replace('@','-').replace('.','-');
        me.avatar = "http://png-4.findicons.com/files/icons/175/halloween_avatar/32/jack_skellington.png";
        socket.emit('logged');
        users[me.id] = me;
        io.sockets.emit('newusr', me);
        
    });
    
    socket.on('disconnect',function(){
        if(!me){
            return false;
        }
        delete users[me.id];
        io.sockets.emit('disusr', me);
    });
    
});