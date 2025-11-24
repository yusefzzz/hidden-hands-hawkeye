import { userInput, closeInput } from "./input";
import { Card } from "../game/objects/Card";
import { Deck } from "../game/objects/Deck";
import { Player } from "../game/objects/Player";
import { SinglePlayerGame } from "../game/engine/SinglePlayerGame";
import { VersusAIGame } from "../game/engine/VersusAIGame";
import { GameState } from "../game/engine/GameState";
import { aiMakeGuess, aiPut } from "../game/engine/AI";

main()

async function main(){
    console.log("\nWelcome to hidden hands")
    console.log("Choose an option from the menu below\n")
    let choice: string = ""
    while (choice != "X"){
        console.log("MENU:")
        let options = ["Play single player mode", "Play 1v1 against AI"];
        for (let i = 1; i < options.length + 1; i ++){
            console.log(" " + i + ". " + options[i - 1])
        }
        console.log(" X: Quit")
        choice = await userInput("Enter choice")
        //choice = input.upper()
        if (choice == "1"){
            await playSinglePlayer()
        }
        else if (choice == "2"){
            await playAgainstRobot()
        }
        else if (choice == "X"){
            //End game
            console.log("Ending game")
            closeInput()
            
        }
    }
}

async function playSinglePlayer(){
    console.log("Play hidden hands - 1 player\n")
    let game = new SinglePlayerGame();
    game.start();

    while (game.getState() != GameState.GAME_OVER){
        switch (game.getState()){

            case GameState.PLAYER_TURN: 
                console.log("Cards to choose from: ");
                let hand: Deck = game.getPlayerHand();
                console.log(hand.displayDeckStr());
                let cardNumber: number = 0;
                while (cardNumber < 1 || cardNumber > hand.getCards().length){
                    try {
                        cardNumber = Number(await userInput("Choose a card to put down... (1 to choose first/leftmost card, 2 to choose second card, and so on)\n"));
                    } catch (e) {
                        cardNumber = 0;
                    }
                }
                game.chooseCard(cardNumber);
                break;

            case GameState.PLAYER_GUESSING:
                console.log("Card has been put down");
                console.log("Your guesses: ");
                let guesses: [number,string][] = game.getGuesses()
                for (let i = 1; i < guesses.length + 1; i++){
                    console.log("- " + i + " cards down: " 
                        + guesses[i-1]![0] 
                        + " -> " 
                        + guesses[i-1]![1]);
                }
                console.log("\n");
                let guess: number = 0;
                while (guess < 1){
                    try {
                        guess = Number(await userInput("Guess the sum of the cards on the table...\n"));
                    } catch (e) {
                        guess = 0;
                    }
                }
                console.log(game.guess(guess));
                break;
            
            case GameState.VICTORY:
                console.log("Congratulations! You just won after " + game.getGuesses().length + " guesses!\n")
                console.log("Recap:\n" +game.finishGame());
                break;

            case GameState.DEFEAT:
                console.log("Unlucky! You lost after " + game.getGuesses().length + " guesses\n")
                console.log("Recap:\n" +game.finishGame());
                break;
        }
    }

}

async function playAgainstRobot(){
    console.log("Play hidden hands - against AI\n")
    let game = new VersusAIGame();
    game.start();

    while (game.getState() != GameState.GAME_OVER){
        switch (game.getState()){

            case GameState.PLAYER_TURN: 
                console.log("Sum of your table cards: " + game.getTableValue(0))
                console.log("Cards to choose from: ");
                let playerHand: Deck = game.getHand(0);
                console.log(playerHand.displayDeckStr());
                let playerCardNumber: number = 0;
                while (playerCardNumber < 1 || playerCardNumber > playerHand.getCards().length){
                    try {
                        playerCardNumber = Number(await userInput("Choose a card to put down... (1 to choose first/leftmost card, 2 to choose second card, and so on)\n"));
                    } catch (e) {
                        playerCardNumber = 0;
                    }
                }
                game.chooseCard(0, playerCardNumber);
                break;

            case GameState.AI_TURN: 
                let next = await userInput("Press enter to continue...");
                console.log("Cards to choose from: ");
                let aiHand = game.getHand(1);
                console.log(aiHand.displayDeckStr());
                let aiCardNumber = aiPut(aiHand);
                game.chooseCard(1, aiCardNumber);
                break;

            case GameState.PLAYER_GUESSING:
                console.log("AI has put a card down\n");
                console.log("Your guesses: ");
                let playerGuesses: [number,string][] = game.getGuesses(0)
                for (let i = 1; i < playerGuesses.length + 1; i++){
                    console.log("- " + i + " cards down: " 
                        + playerGuesses[i-1]![0] 
                        + " -> " 
                        + playerGuesses[i-1]![1]);
                }
                console.log("\n");
                let playerGuess: number = 0;
                while (playerGuess < 1){
                    try {
                        playerGuess = Number(await userInput("Guess the sum of the cards on the table...\n"));
                    } catch (e) {
                        playerGuess = 0;
                    }
                }
                console.log("You have guessed: " + playerGuess);
                console.log(game.guess(playerGuess, 0));
                game.checkWin();
                break;

            case GameState.AI_GUESSING:
                console.log("You have put a card down, the sum of your table is now " + game.getTableValue(0) + "\n");
                console.log("AI's guesses: ");
                let aiGuesses = game.getGuesses(1)
                for (let i = 1; i < aiGuesses.length + 1; i++){
                    console.log("- " + i + " cards down: " 
                        + aiGuesses[i-1]![0] 
                        + " -> " 
                        + aiGuesses[i-1]![1]);
                }
                console.log("\n");
                console.log("AI is thinking...\n")
                let aiGuess: number = aiMakeGuess(game.getGuesses(1));
                console.log("AI has guessed: " + aiGuess);
                console.log(game.guess(aiGuess, 1));
                break;
            
            case GameState.VICTORY:
                console.log("Congratulations! You just won after " + game.getGuesses(0).length + " guesses!\n")
                console.log("Recap:\n" +game.finishGame());
                break;

            case GameState.DEFEAT:
                console.log("Unlucky! You lost after " + game.getGuesses(0).length + " guesses\n")
                console.log("Recap:\n" +game.finishGame());
                break;
            
            case GameState.BOTH_VICTORY:
                console.log("Congratulations! BOTH of you won after " + game.getGuesses(0).length + " guesses!\n")
                console.log("Recap:\n" +game.finishGame());
                break;

            case GameState.BOTH_DEFEAT:
                console.log("Unlucky! BOTH of you lost after " + game.getGuesses(0).length + " guesses\n")
                console.log("Recap:\n" +game.finishGame());
                break;
        }
    }

}
