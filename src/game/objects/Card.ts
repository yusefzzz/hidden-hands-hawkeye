export class Card {
    private colour: string;
    private value: number;

    constructor(colour: string, value: number){
        this.colour = colour;
        this.value = value;
    }

    getColour(){
        return this.colour
    }
    getValue(){
        return this.value;
    }

}