import { GameState } from "./GameState";
import { Deck } from "../objects/Deck";
import { Player } from "../objects/Player";
import { Card } from "../objects/Card";

export class VersusAIGame {
    private state: GameState;
    private players: [Player, Player];

    constructor() {
        this.state = GameState.DEALING; 
        this.players = [new Player(this.createDeck(false), // Player can see their own deck
                                new Deck([], 13, true)), 
                        new Player(this.createDeck(true), 
                                new Deck([], 13, true))]
    }

    createDeck(isHidden: boolean){
        const colours = ["red", "green", "blue", "yellow"];
        let deck = new Deck([], 13, isHidden)
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

    getHand(playerIndex: number){
        return this.players[playerIndex]!.getHand();
    }

    chooseCard(playerIndex:number, cardIndex: number) {
        this.players[playerIndex]!.put(cardIndex - 1);
        if (playerIndex == 0){
            this.state = GameState.AI_GUESSING;
        } 
        else {
            this.state = GameState.PLAYER_GUESSING;
        }
            
    }

    guess(sum: number, playerIndex: number) {
        if (sum > this.players[(playerIndex == 0? 1:0)]!.getTableValue()){ 
            this.players[playerIndex]!.addGuess(sum, "LOWER")
            if (this.players[0].getGuesses().length > 11
                && this.players[1].getGuesses().length > 11){
                this.state = GameState.BOTH_DEFEAT;
            }
            else {
                if (playerIndex == 0){
                    this.state = GameState.PLAYER_TURN;
                } else {
                    this.state = GameState.AI_TURN
                }
            }
            return "Lower!\n"
        }
        else if (sum < this.players[(playerIndex == 0? 1:0)]!.getTableValue()){
            this.players[playerIndex]!.addGuess(sum, "HIGHER")
            if (this.players[0].getGuesses().length > 11
                && this.players[1].getGuesses().length > 11){
                this.state = GameState.BOTH_DEFEAT;
            }
            else {
                if (playerIndex == 0){
                    this.state = GameState.PLAYER_TURN;
                } else {
                    this.state = GameState.AI_TURN
                }
            }
            return "Higher!\n"
        }
        else {
            this.players[playerIndex]!.addGuess(sum, "EQUAL");
            if (playerIndex == 0){
                this.state = GameState.PLAYER_TURN;
            } else {
                this.state = GameState.AI_TURN
            }
            return "SPOT ON!\n"
        }
        
    }

    checkWin(){
        const playerGuesses = this.players[0].getGuesses();
        const lastPlayerGuess = playerGuesses[playerGuesses.length - 1]!;
        const aiGuesses = this.players[1].getGuesses();
        const lastAIGuess = aiGuesses[aiGuesses.length - 1]!;
        if (lastPlayerGuess[1] == "EQUAL" && lastAIGuess[1] == "EQUAL"){
            this.state = GameState.BOTH_VICTORY;
        }
        else if (lastPlayerGuess[1] == "EQUAL"){
            this.state = GameState.VICTORY;
        }
        else if (lastAIGuess[1] == "EQUAL"){
            this.state = GameState.DEFEAT;
        }
    }
    getTableValue(playerIndex: number){
        return this.players[playerIndex]!.getTableValue();
    }

    getGuesses(playerIndex: number){
        return this.players[playerIndex]!.getGuesses();
    }

    finishGame(){
        if (this.state == GameState.VICTORY || this.state == GameState.DEFEAT || 
            this.state == GameState.BOTH_VICTORY || this.state == GameState.BOTH_DEFEAT){
                this.state = GameState.GAME_OVER;
            }
        let recap: string = "";

        this.players[0].finishGame() // "Un-hides" table deck
        let tableCards: Card[] = this.players[1].getTable().getCards();
        let guesses: [number, string][] = this.players[0].getGuesses();
        let count: number = 0;
        recap += "1. Player guesses against AI:\n";
        for (let i = 0; i < guesses.length; i++){
            count += tableCards[i]!.getValue()
            recap += " Card " + (i + 1) + ": " 
                + tableCards[i]!.getValue() 
                + " >> " + count 
                + " (guessed: " + guesses[i]![0] + ")"
                + "\n";
        }
        recap += "\n";
        this.players[1].finishGame() // "Un-hides" table deck
        tableCards = this.players[0].getTable().getCards();
        guesses = this.players[1].getGuesses();
        count = 0;
        recap += "2. AI guesses against player:\n";
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




/*export class VersusAIGame {
    private state: GameState;
    private players: [Player, Player]; // Person and AI
    private currentPlayerIndex: number; // 0 = human, 1 = AI

    constructor() {
        this.state = GameState.DEALING;

        const human = new Player(this.createDeck(), 
                                new Deck([], 13, true));
        const ai = new Player(this.createDeck(), 
                                new Deck([], 13, true));

        this.players = [human, ai];
        this.currentPlayerIndex = 0;
    }

    private createDeck() {
        const colours = ["red", "green", "blue", "yellow"];
        let deck = new Deck([], 13, true)
        for (let i: number = 1; i < 14; i++){
            const colour = colours[Math.floor(Math.random()*4)]!
            deck.add(new Card(colour, i, true))
        }
        deck.shuffle();
        return deck;
    }

    getState() {
        return this.state;
    }

    start() {
        this.state = GameState.PLAYER_TURN; 
    }

    getHumanHand() {
        return this.players[0].getHand();
    }

    getAIHand() {
        return this.players[1].getHand();
    }

    getGuesses() {
        return this.players[this.currentPlayerIndex]!.getGuesses();
    }

    getTableValue(playerIndex: number) {
        return this.players[playerIndex]!.getTableValue();
    }


    chooseCard(index: number) { // For human turn only
        const player = this.players[this.currentPlayerIndex]!;
        player.put(index - 1);
        this.state = GameState.GUESSING;
    }

    guess(sum: number) {
        const guesser = this.players[this.currentPlayerIndex];
        const opponent = this.players[1 - this.currentPlayerIndex];

        const actual = opponent.getTableValue();

        if (sum > actual) {
            guesser.addGuess(sum, "LOWER");
            if (guesser.getGuesses().length >= 12) {
                this.state = GameState.DEFEAT;
            } else {
                this.endTurn();
            }
            return "Lower!\n";
        }

        if (sum < actual) {
            guesser.addGuess(sum, "HIGHER");
            if (guesser.getGuesses().length >= 12) {
                this.state = GameState.DEFEAT;
            } else {
                this.endTurn();
            }
            return "Higher!\n";
        }

        // Correct
        guesser.addGuess(sum, "EQUAL");
        this.state = GameState.VICTORY;
        return "SPOT ON!\n";
    }

    // -------------------------
    // AI turn (automated)
    // -------------------------
    aiTurn() {
        const ai = this.players[1];
        const human = this.players[0];

        // AI chooses a random card to play
        const randomIndex = Math.floor(Math.random() * ai.getHand().getCards().length);
        ai.put(randomIndex);

        this.state = GameState.GUESSING; // AI is now guessing

        // AI makes a guess (simple strategy)
        const actual = human.getTableValue();

        // AI guess = randomised around actual
        let guess = actual + Math.floor(Math.random() * 5 - 2); // +- 2 random
        if (guess < 1) guess = 1;

        return this.aiGuess(guess);
    }

    private aiGuess(sum: number) {
        const ai = this.players[1];
        const human = this.players[0];

        const actual = human.getTableValue();

        if (sum > actual) {
            ai.addGuess(sum, "LOWER");
            if (ai.getGuesses().length >= 12) this.state = GameState.VICTORY;
            else this.endTurn();
            return `AI guessed ${sum}: LOWER\n`;
        }

        if (sum < actual) {
            ai.addGuess(sum, "HIGHER");
            if (ai.getGuesses().length >= 12) this.state = GameState.VICTORY;
            else this.endTurn();
            return `AI guessed ${sum}: HIGHER\n`;
        }

        ai.addGuess(sum, "EQUAL");
        this.state = GameState.DEFEAT; // Human loses
        return `AI guessed ${sum}: SPOT ON!\n`;
    }

    // -------------------------
    // Turn handling
    // -------------------------
    private endTurn() {
        // Swap players
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;

        if (this.currentPlayerIndex === 0) {
            this.state = GameState.PLAYER_TURN;   // back to human
        } else {
            this.state = GameState.AI_TURN;       // AI chooses card
        }
    }

    finishGame() {
        this.state = GameState.GAME_OVER;

        let recap = "";
        for (let p = 0; p < 2; p++) {
            recap += `\nPlayer ${p === 0 ? "HUMAN" : "AI"} played:\n`;
            this.players[p].finishGame(); // reveal table
            const table = this.players[p].getTable().getCards();
            let running = 0;
            for (let i = 0; i < table.length; i++) {
                running += table[i].getValue();
                recap += ` Card ${i+1}: ${table[i].getValue()} → ${running}\n`;
            }
        }

        return recap;
    }
}*/
