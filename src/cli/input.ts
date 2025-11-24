import * as readline from "readline";

const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function userInput(i: string): Promise<string> {
    return new Promise(resolve => io.question(i, resolve))
}

export function closeInput(){
    io.close()
    process.exit(0)
}