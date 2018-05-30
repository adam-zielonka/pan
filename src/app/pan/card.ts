import { Figure } from "./figure"
import { Color } from "./color"

export class Card {
    public constructor(
        private value : Figure,
        private color : Color
    ){}

    public getValue() : Number {
        return this.value
    }

    public getColor() : Number {
        return this.color
    }

    public getColorStyle() : String {
        switch (this.color) {
            case Color.Karo: 
            case Color.Kier: return "red"
            case Color.Trefl:
            case Color.Pik: return "black"
        }
    }

    private numberToColor() : String {
        switch (this.color) {
            case Color.Karo: return "♦"
            case Color.Kier: return "♥"
            case Color.Trefl: return "♣"
            case Color.Pik: return "♠"
        }
    }

    private numberToFigure() : String {
        switch (this.value) {
            case Figure.f9: return "9"
            case Figure.f10: return "10"
            case Figure.J: return "J"
            case Figure.Q: return "Q"
            case Figure.K: return "K"
            case Figure.A: return "A"
        }
    }

    public toString(): String {
        return `${this.numberToFigure()}${this.numberToColor()}`
    }

    public static generateDeck() : Card[] {
        var deck : Card[] = []
        for (let i = 9; i <= 14; i++) {
          for (let j = 1; j <= 4; j++) 
            deck.push(new Card(i,j))
        }
        return deck
    }

    public static shuffleDeck(deck : Card[]) : Card[] {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]]
        }
        return deck
    }
}
