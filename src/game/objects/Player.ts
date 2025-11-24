import { Deck } from "./Deck"

export class Player {
    private hand: Deck;
    private table: Deck;
    private guesses: [number, string][];

    constructor(hand: Deck, table: Deck){
        this.hand = hand;
        this.table = table;
        this.guesses = []
    }

    findIndex(colour: string, value: number){ //Looks for card in player's hand
        const cards = this.hand.getCards();
        for (let i = 0; i < cards.length; i++){
            const card = cards[i];
            if (card != undefined) 
                if ((value == card.getValue() && colour == card.getColour())) 
                    return i;
        }
        return null;
    }
    
    put(i: number){
        const cardToPut = this.hand.removeFromIndex(i)!;
        this.table.add(cardToPut);
    }
    
    getTable(){
        return this.table;
    }

    getTableValue(){
        let count = 0;
        for (let card of this.table.getCards()){
            count += card.getValue();
        }
        return count;
    }

    getHand(){
        return this.hand;
    }

    addGuess(sum: number, direction: string){
        this.guesses.push([sum, direction]);
    }

    getGuesses(){
        return this.guesses;
    }

    finishGame(){
        this.table.setIsHidden(false);
    }
}