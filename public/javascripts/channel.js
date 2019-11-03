var socket = null;
var channel = $("#channelName").text();
var name = "";
var channelMembers =[];
$('#toindex').on('click',()=>location.href='/');
if (!sessionStorage.hasOwnProperty("username")) {
    $('.modal').show();
}
else{
    name = sessionStorage['username'];
    $('#login-info').text("Logged as "+ name);
    connectSocket();
}
function addMessage(container,author,time,text){
    container.append("<div class='message'><div class='author'>"
        +author+"</div><div class='time'>"+time.toLocaleTimeString()+"</div><div class='text'>"+text+"</div></div>");
}

function connectSocket() {
    socket = io.connect("http://localhost:3030");
    socket.emit('join-chat', name, channel);
    $.get('/'+channel,{ajax:'true'}).done((data)=>{
       let channelInfo = JSON.parse(data);
       channelMembers = channelInfo.users;
       channelMembers.push(name);
       channelMembers.forEach((e)=>{
           $('#ul-members').append("<li class='li-members' id='members-element"+e+"'>"+e+"</li>");
       });
       let container = $("#ul-messages");
       channelInfo.history.forEach((e)=>{
           console.log(e.time);
          addMessage(container,e.author,new Date(e.time),e.message);
       });
       addMessage($("#ul-messages"),'Channel',new Date(),"You joined the chat");
    });
    socket.on('newUser', (userName) => {
        addMessage($("#ul-messages"),'Channel',new Date(),userName + " joined to chat");
        channelMembers.push(userName);
        $('#ul-members').append("<li class='li-members' id='members-element"+userName+"'>"+userName+"</li>");
    });
    socket.on('msg', (user,time, message) => {
        addMessage($("#ul-messages"),user,new Date(time),message);
    });
    socket.on('exitUser',(name)=>{
        addMessage($("#ul-messages"),'Channel',new Date(),name + " left the chat");
        let index = channelMembers.indexOf(name);
        if (index !== -1) channelMembers.splice(index, 1);
        $('#members-element'+name).detach();
    });

}
function saveLogin() {
    if ($('#username').val() != '') {
        name = sessionStorage['username'] = $('#username').val();
       connectSocket();
        $('.modal').hide();
        $('#login-info').text("Logged as "+ name);
    }
}
function sendMessage() {
    var msg = $('#lineInput').val();
    if (msg != '') {
        socket.emit('msg', msg);
        addMessage($("#ul-messages"),name,new Date(),msg);
        $('input').val(null);
    }
}

$('#username').keypress((e) => {
    if (e.key === 'Enter')
        saveLogin();
});
$('#lineInput').keypress((e) => {
    if (e.key === 'Enter') sendMessage();
});
$("#sendButton").on("click", () => sendMessage());
$('#myBtn').on('click', () => saveLogin());

