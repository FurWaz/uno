class Player {
    static indexOf(player, list) {
        let index = -1;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == player.id) {
                index = i;
                break;
            }
        }
        return index;
    }

    constructor(id) {
        this.id = id;
        this.name = "";
        this.cards = [];
        this.unoCalled = false;
        this.room = null;
    }
}

module.exports = Player;