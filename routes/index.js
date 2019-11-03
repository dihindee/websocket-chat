var express = require('express');
var router = express.Router();
const io = require('socket.io').listen(3030);
var channelList = [];
function createChannel(channelName){
  channelList.push({name:channelName,users:[],history:[]});
}
createChannel('Hello World');
createChannel('Random');
router.get('/', function (req, res, next) {
    if (req.query.ajax === 'true') {
        let list = [];
        channelList.forEach((e) => {
            list.push(e.name)
        });
        res.end(JSON.stringify(list));
    } else
        res.render('index');
});
router.get('/:channel', function (req, res, next) {
    const channel = req.params.channel;
    if (channelList.find((e) => {
        return e.name === channel
    }) !== undefined) {
        if (req.query.ajax === 'true') {
            res.end(JSON.stringify(channelList.find((e)=>{return e.name===channel})));
        } else
            res.render('channel', {channelName: channel});
    } else res.render('error', {message: "This channel is unavailable", error: {status: "404 not found", stack: ''}});
});
io.sockets.on('connection', (socket) => {
    var name;
    var channel;
    socket.on('join-chat', (userName, channelName) => {
        name = userName;
        channel = channelName;
        var ch = channelList.find((e) => {
            return e.name === channel;
        });
        let time = new Date();
        ch.history.push({author: "Channel", time: time.toUTCString(), message: userName + ' joined to chat'});
        ch.users.push(userName);
        socket.join(channelName);
        socket.broadcast.to(channelName).emit('newUser', userName);
    });
    socket.on('msg', (message) => {
        let time = new Date();
        channelList.find((e) => {
            return e.name === channel;
        }).history.push({author: name, time: time.toUTCString(), message: message});
        socket.broadcast.to(channel).emit('msg', name, time, message);
    });
    socket.on('disconnect', () => {
      channelList.find((e) => {
        return e.name === channel;
      }).history.push({author: "Channel", time: new Date().toUTCString(), message: name + ' left the chat'});
        let arr = channelList.find((e) => {
            return e.name === channel
        }).users;
        let index = arr.indexOf(name);
        if (index !== -1) arr.splice(index, 1);
        socket.broadcast.to(channel).emit('exitUser', name);
    });
});


module.exports = router;
