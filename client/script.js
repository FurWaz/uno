let socket = io();

document.s = socket;
let playBtn = document.getElementById("play-btn");
let nameInput = document.getElementById("name-input");
let roomInput = document.getElementById("room-input");

let player = {
    cards: [],
    room: null,
    id: null,
    name: null
};

playBtn.onclick = () => {
    socket.emit("setName", nameInput.value);
    socket.emit("joinRoom", roomInput.value);
    player.name = nameInput.value;
}

socket.on("updateRoom", events => {
    console.log("update room: " + events.map(e => e.name));
    events.forEach(ev => {
        switch (ev.name) {
            case "addPlayer":
                if (ev.data.name == player.name) {
                    player.id = ev.data.id;
                    initPartie(ev.data.players, ev.data.cards);
                } else {
                    if (player.room != null) {
                        addPlayer({id: ev.data.id, name: ev.data.name});
                    }
                }
                break;
            case "removePlayer":
                removePlayer(ev.data.id);
                break;
            case "punchPlayer":
                punchPlayer(ev.data);
                break;
            case "addCard":
                addCard(ev.data);
                break;
            case "winner":
                winner(ev.data.id);
                break;
            default: break;
        }
    });
});

function Log(msg) {
    let log = document.getElementById("log");
    let p = document.createElement("p");
    p.innerHTML = msg;
    log.appendChild(p);
}

function winner(id) {
    let p = player.room.players.find(p => p.id == id);
    if (id == player.id) p = player;
    console.log(p.name+" a gagné la partie");
}

function addCard(data) {
    let p = player.room.players.find(p => p.id == data.id);
    if (data.id == player.id) p = player;
    p.cards.splice(data.place, 1);
    player.room.cards.push(data.tag);
    Log(p.name+" a posé une carte");
}

function unoCalled(id) {
    let p = player.room.players.find(p => p.id == id);
    Log(player.name+" a appelé uno");
}

function punchPlayer(data) {
    let p = player.room.players.find(p => p.id == data.id);
    if (data.id == player.id) p = player;
    p.cards.push(data.tags);
    Log(p.name+" a recu "+data.tags.length+" cartes");
}

function removePlayer(id) {
    let p = player.room.players.find(p => p.id == id);
    if (data.id == player.id) p = player;
    player.room.players.splice(player.room.players.indexOf(p), 1);
    Log(p.name+" a quitté la partie");
}

function addPlayer(data) {
    player.room.players.push({id: data.id, name: data.name, cards: []});
    Log(data.name+" a rejoint la partie");
}

function initPartie(players, cards) {
    player.room = {
        players : players,
        cards: cards
    };
    document.getElementById("menu").remove();
    Log("vous avez rejoint la partie");
    Log("Joueurs : " + players.map(p => p.name));
}