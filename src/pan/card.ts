export enum Figure {
    f9 = 9, f10, J, Q, K, A, Empty
}

export enum Color {
    Kier = 1, Karo, Trefl, Pik, Empty
}

export class Card {

    public static numberToColor(color : Color) : string {
        switch (color) {
            case Color.Karo: return "♦"
            case Color.Kier: return "♥"
            case Color.Trefl: return "♣"
            case Color.Pik: return "♠"
            default: return ""
        }
    }

    public static numberToFigure(figure : Figure) : string {
        switch (figure) {
            case Figure.f9: return "9"
            case Figure.f10: return "10"
            case Figure.J: return "J"
            case Figure.Q: return "Q"
            case Figure.K: return "K"
            case Figure.A: return "A"
            default: return ""
        }
    }

    public constructor(
        private value : Figure = Figure.Empty,
        private color : Color = Color.Empty
    ){}

    public getValue() : number {
        return this.value
    }

    public getColor() : number {
        return this.color
    }

    public getColorStyle() : string {
        switch (this.color) {
            case Color.Karo: 
            case Color.Kier: return "red"
            case Color.Trefl:
            case Color.Pik: return "black"
            default: return ""
        }
    }

    public toString(): string {
        return `${this.numberToFigure()}${this.numberToColor()}`
    }

    public isEqual(card : Card) : boolean {
        return this.value === card.getValue() && this.color === card.getColor()
    }

    public isPik() : boolean {
        return this.color === Color.Pik
    }

    public compare(card : Card) : number {
        if(this.value < card.getValue()) { return -1 }
        if(this.value > card.getValue()) { return 1 }
        return 0
    }
    
    private numberToColor() : string {
        return Card.numberToColor(this.color)
    }

    private numberToFigure() : string {
        return Card.numberToFigure(this.value)
    }

}
