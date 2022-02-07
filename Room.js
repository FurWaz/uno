const Card = require('./Card');
const Player = require('./Player');

class RoomEvent {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
}

class Room {
    constructor(id) {
        this.players = [];
        this.cards = [Card.getRandom()];
        this.events = [];
        this.id = id;
        this.playing = 0;
    }

    clearCards() {
        this.cards = [];
        this.events.push(new RoomEvent("clearCards", {}));
    }
    
    addCard(player, place) {
        let card = player.cards[place]
        if (!Card.isValid(card, this.cards[this.cards.length-1])) return;
        player.cards.splice(place, 1);
        this.cards.push(card);
        this.playing = (this.playing+1) % this.players.length;
        this.events.push(new RoomEvent("addCard", {id: player.id, tag: card}));
        if (player.cards.length < 1)
            this.events.push(new RoomEvent("winner", {id: player.id}));
    }

    addPlayer(player) {
        if (this.players.find(p => p.id == player.id) != undefined) return;
        this.players.push(player);
        this.events.push(new RoomEvent("addPlayer", {players: this.players.map(p => {return {id: p.id, name: p.name, cards: p.cards}}), id: player.id, name: player.name, cards: this.cards}));
    }

    removePlayer(player) {
        this.players.splice(Player.indexOf(player, this.players), 1);
        this.events.push(new RoomEvent("removePlayer", {id: player.id}));
    }

    punchPlayer(player, nbCards) {
        let tags = []
        for (let i = 0; i < nbCards; i++) tags.push(Card.getRandom());
        tags.forEach(tag => player.cards.push(tag));
        this.events.push(new RoomEvent("punchPlayer", {id: player.id, tags: tags}));
    }

    callUno(player) {
        this.events.push(new RoomEvent("unoCalled", {id: player.id}));
    }

    updatePlayers(io) {
        this.players.forEach(p => {
            io.sockets.sockets.get(p.id).emit("updateRoom", this.events);
        });
        this.events = [];
    }
}

module.exports = Room;