import { GameState } from "./GameState"
import { Deck } from "../objects/Deck"
import { Player } from "../objects/Player"
import { Card } from "../objects/Card"


export class SinglePlayerGame {
    private state: GameState;
    private player: Player;

    constructor() {
        this.state = GameState.DEALING; // (Setting up game)
        this.player = new Player(this.createSinglePlayerDeck(), 
                                new Deck([], 13, true)); // Deck and empty table
    }

    createSinglePlayerDeck(){
        const colours = ["red", "green", "blue", "yellow"];
        let deck = new Deck([], 13, true)
        for (let i: number = 1; i < 14; i++){
            const colour = colours[Math.floor(Math.random()*4)]!
            deck.add(new Card(colour, i))
        }
        deck.shuffle();
        return deck;
    }

    getState(){
        return this.state;
    }

    start(){
        this.state = GameState.PLAYER_TURN;
    }

    getPlayerHand(){
        return this.player.getHand();
    }

    chooseCard(index: number) {
        this.player.put(index - 1);
        this.state = GameState.PLAYER_GUESSING;
    }

    guess(sum: number) {
        if (sum > this.player.getTableValue()){ 
            this.player.addGuess(sum, "LOWER")
            if (this.player.getGuesses().length > 11){
                this.state = GameState.DEFEAT;
            }
            else {
                this.state = GameState.PLAYER_TURN;
            }
            return "Lower!\n"
        }
        else if (sum < this.player.getTableValue()){
            this.player.addGuess(sum, "HIGHER")
            if (this.player.getGuesses().length > 11){
                this.state = GameState.DEFEAT;
            }
            else {
                this.state = GameState.PLAYER_TURN;
            }
            return "Higher!\n"
        }
        else {
            this.player.addGuess(sum, "EQUAL");
            this.state = GameState.VICTORY;
            return "SPOT ON!\n"
        }
        
    }

    /*checkWin(){
        if (this.player.getGuesses().length >= 12) {
            this.state = GameState.GAME_OVER;
            return true;
        }
        this.state = GameState.PLAYER_TURN;
        return false;
    }*/

    getTableValue(){
        return this.player.getTableValue();
    }

    getGuesses(){
        return this.player.getGuesses();
    }

    finishGame(){
        if (this.state == GameState.VICTORY || this.state == GameState.DEFEAT) 
            this.state = GameState.GAME_OVER;
        let recap: string = "";
        this.player.finishGame() // "Un-hides" table deck
        const tableCards: Card[] = this.player.getTable().getCards();
        const guesses: [number, string][] = this.player.getGuesses();
        let count: number = 0;
        for (let i = 0; i < guesses.length; i++){
            count += tableCards[i]!.getValue()
            recap += " Card " + (i + 1) + ": " 
                + tableCards[i]!.getValue() 
                + " >> " + count 
                + " (guessed: " + guesses[i]![0] + ")"
                + "\n";
        }
        return recap;
    }
}
