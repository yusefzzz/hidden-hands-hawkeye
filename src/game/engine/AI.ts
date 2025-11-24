import { Deck } from "../objects/Deck"

export function aiMakeGuess(guesses: [number, string][]){ 
    if (guesses.length == 0) return 1 + Math.floor(Math.random() * 13)
    let lastGuess = guesses[guesses.length - 1]!
    if (lastGuess[1] == "HIGHER"){
        return Math.max(Math.floor(6.5*guesses.length), lastGuess[0]) + 1 + Math.floor(Math.random() * 13)
    } else {
        return Math.max(lastGuess[0] - 6, 0) + Math.floor(Math.random() * 13)
    }
}

export function aiPut(hand: Deck){
    return 1 + Math.floor(Math.random() * hand.getCards().length)
}