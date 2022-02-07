class Card {
    static COLOR_RED = 1;
    static COLOR_BLUE = 2;
    static COLOR_YELLOW = 3;
    static COLOR_GREEN = 4;
    static COLOR_2MORE = 5;
    static COLOR_4MORE = 6;
    static COLOR_CHANGE = 7;

    static indexOf(card, list) {
        let index = -1;
        for (let i = 0; i < list.length; i++) {
            if (list[i].getTag() == card.getTag()) {
                index = i;
                break;
            }
        }
        return index;
    }

    
    static getRandom() {
        let number = Math.floor(Math.random() * 10);
        let color = Math.floor(Math.random() * 4) + 1;
        return new Card(number, color);
    }

    static fromTag(tag) {
        let number = tag % 10
        let color = Math.floor(tag / 10);
        return new Card(number, color);
    }

    /**
     * 
     * @param {number} number 
     * @param {number} color 
     */
    constructor(number, color) {
        this.number = number;
        this.color = color;
    }
    
    getTag() {
        return this.number + this.color * 10;
    }
    
    static isValid(c1, c2) {
        let card1 = Card.fromTag(c1);
        let card2 = Card.fromTag(c2);
        return card1.number == card2.number || card1.color == card2.color;
    }
}

module.exports = Card;