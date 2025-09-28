const express = require('express');
const path = require('path');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const match = require('./match.js');

const app = express();
const port = 3000;

app.use(express.json())
app.use(express.static('public'));
app.use(express.static('memory'));

app.get('/', (req, res) => {
    res.send("via discord bot");
});

app.post('/create-match', (req, res) => {
    console.log("received: ", req.body);
    const newestMatch = new match.Match(req.body);
    res.send({customURL:`http://localhost:3000/get-match?match=${newestMatch.id}`});
});

app.get('/get-match', (req, res) => {
    console.log("match geklikt ", req.query.match);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/ttt', (req, res) => {
    console.log("before");
    const matchData = match.matchManager.FindMatch(req.body.value);
    console.log("ttt connect", req.body);
});

app.post('/memory', (req, res) => {
    const matchData = match.matchManager.FindMatch(req.body.value);
    console.log("mem connect", req.body);

    res.sendFile(path.join(__dirname, 'memory', 'index.html'));
});

app.get('/memory', (req, res) => {
  res.sendFile(path.join(__dirname, 'memory', 'index.html'));
});

const server = http.createServer(app);
const io = new SocketIOServer(server); 

require('./memory')(io, app);  

server.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

module.exports = { app, io };  