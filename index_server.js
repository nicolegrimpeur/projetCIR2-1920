const port = 26000;

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.use(express.static(__dirname + "/"));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/views/main.html');
});

app.get('/jouer', (req, res, next) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/comment-jouer', (req, res, next) => {
    res.sendFile(__dirname + '/views/comment-jouer.html');
});

io.sockets.on('connection', function (socket) {
    io.emit('Hello', 'A new connection on our website !'); // permet d'envoyer le message à toutes les connections
});

server.listen(port);
console.log('Server instantiated');