import { Card } from "./Card"

export class Deck {
    private cards: Card[];
    private maxSize: number;
    private isHidden: boolean;

    constructor(cards: Card[], maxSize: number, isHidden: boolean){
        this.cards = cards;
        this.maxSize = maxSize;
        this.isHidden = isHidden
    }

    getIsHidden(){
        return this.isHidden;
    }

    setIsHidden(isHidden: boolean){
        this.isHidden = isHidden;
    }

    getCards(){
        return this.cards;
    }

    getSize(){
        return this.cards.length;
    }

    add(card: Card){
        if (this.cards.length < this.maxSize){
            this.cards.push(card);
        }
    }

    addToIndex(card: Card, i: number){
        if (this.cards.length < this.maxSize){
            this.cards.splice(i, 0, card);
        }
    }

    remove(){
        if (this.cards.length > 0){
            return this.cards.pop();
        }
        return;
    }

    removeFromIndex(i: number){
        if (i < this.cards.length && i > -1){
            const cardToRemove = this.cards[i];
            this.cards.splice(i, 1);
            return cardToRemove;
        }
    }

    shuffle(){
        let newCards: Card[] = [];
        while (this.cards.length > 0){
            let i = Math.floor(Math.random() * (this.cards.length));
            let card = this.cards[i];
            this.cards.splice(i, 1);
            if (card != undefined) newCards.push(card);
        }
        this.cards = newCards;
    }

    displayDeckStr(){
        let display: string = "";
        let lines: string[] = ["", "", ""]
        for (let card of this.cards){
            let cardStr: string[] = ["", "", ""];
            cardStr[0] += " __   "
            cardStr[1] += "|" + (
                this.isHidden? 
                    " X" : 
                    (" ".repeat(2 - (String(card.getValue())).length) + card.getValue())) 
                        + "|  "

            cardStr[2] += "|__|  "
            switch (card.getColour()){
                case "red":
                    for (let i = 0; i < lines.length; i++){
                        cardStr[i] = "\x1b[31m" + cardStr[i];
                    }
                    break;
                case "green":
                    for (let i = 0; i < lines.length; i++){
                        cardStr[i] = "\x1b[32m" + cardStr[i];
                    }
                    break;
                case "yellow":
                    for (let i = 0; i < lines.length; i++){
                        cardStr[i] = "\x1b[33m" + cardStr[i];
                    }      
                    break;
                case "blue":
                    for (let i = 0; i < lines.length; i++){
                        cardStr[i] = "\x1b[34m" + cardStr[i];
                    }
                    break;
            }
            for (let i = 0; i < lines.length; i++){
                cardStr[i] += "\x1b[0m ";
                lines[i] += cardStr[i]!;
            }
            
        }
        for (let i = 0; i < lines.length; i++){
            display += lines[i] + "\n";
        }
        return display;
    }
}