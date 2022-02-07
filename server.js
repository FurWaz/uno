const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const Room = require('./Room');
const Card = require('./Card');
const Player = require("./Player");

app.get('/*', (req, res) => {
    let path = req.url;
    if (req.url == "/") path = "/index.html";
    path = path.split("?")[0];
    path = __dirname+"/client"+path;
    res.sendFile(path);
});
server.listen(80);

let rooms = [];
let players = [];

io.on("connection", socket => {
    console.log("new client");
    players.push(new Player(socket.id));
    socket.on("disconnect", message => {
        let player = players.find(p => p.id == socket.id);
        players.splice(players.indexOf(player), 1);
        if (player.room == null) return;
        player.room.removePlayer(player);
        player.room.updatePlayers(io);
        if (player.room.players.length < 1)
            rooms.splice(rooms.indexOf(player.room), 1);
    });

    socket.on("setName", name => {
        players.find(p => p.id == socket.id).name = name;
        console.log("client name");
    });

    socket.on("joinRoom", id => {
        console.log("join room");
        let room = rooms.find(r => r.id == id);
        if (room == undefined) {
            room = new Room(id);
            rooms.push(room);
        }
        let player = players.find(p => p.id == socket.id);
        player.room = room;
        room.addPlayer(player);
        room.punchPlayer(player, 7);
        room.updatePlayers(io);
    });

    socket.on("placeCard", place => {
        let player = players.find(p => p.id == socket.id);
        let room = player.room;
        if (room.players.indexOf(player) != room.playing) return;
        if (place > 0 && place < player.cards.length) return;
        room.addCard(player, place);
        room.updatePlayers(io);
    });

    socket.on("getCard", data => {
        let player = players.find(p => p.id == socket.id);
        let room = player.room;
        if (room.players.indexOf(player) != room.playing) return;
        room.punchPlayer(player, 1);
        room.updatePlayers(io);
    });

    socket.on("callUno", data => {
        let player = players.find(p => p.id == socket.id);
        let room = player.room;
        if (player.cards.length < 2) {
            player.unoCalled = true;
            player.room.callUno(player);
        }
        else {
            player.room.players.forEach(p => {
                if (p.cards.length < 2 && !p.unoCalled)
                    room.punchPlayer(p, 2);
            })
        }
        room.updatePlayers(io);
    });
});