(function($){
    var socket = io.connect();
    var msgtpl = $('msgtpl').html();
    var lastmsg = false;
    
    $('#msgtpl').remove();
    
    $('#loginform').submit(function(event){
        event.preventDefault();
        socket.emit('login',{
            username : $('#username').val(),
            mail     : $('#mail').val()
        });
    });
    
    socket.on('logged',function(){
        $('#login').fadeOut();
        $('#message').focus();
    });
    
    
    $('#form').submit(function(event){
        event.preventDefault();
        socket.emit('newmsg', {message: $('#message').val() });
        $('#message').val('');
        $('#message').focus();
    });
    
    socket.on('newmsg', function(message){ 
        console.log(lastmsg +' : me '+ message.user.id);
      if(lastmsg != message.user.id){
            $('#messages').append('<div class="progress">\
                              <div class="determinate" style="width: 100%"></div>\
                              </div>' ); 
            lastmsg = message.user.id;
      }          
       $('#messages').append('<li class="collection-item avatar">\
                               <img src="'+message.user.avatar+'" alt="" class="circle">\
                               <span class="title">'+message.user.username+'</span>\
                               <p>'+message.message+'</p>\
                               </li>' );
                             
       $('#messages').animate({scrollTop : $('#messages').prop('scrollHeight')}, 50);
    });
    
    
    socket.on('newusr',function(user){
        $('#users').append('<img src="'+user.avatar+'" id="'+user.id+'" >');
    });
    
    socket.on('disusr',function(user){
        $('#' + user.id).remove();
    });
    
})(jQuery);