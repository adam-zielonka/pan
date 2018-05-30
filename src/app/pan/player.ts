import { Card } from "./card"
import { Figure } from "./figure"
import { Color } from "./color"

export class Player {
    public cards: Card[] = []
    public id

    public sortCards() {
        this.cards.sort((a,b) => a.compare(b))
    }

    public action(actionCard: Card) : Card {
        for (let i = 0; i < this.cards.length; i++) {
            if(actionCard.isEqual(this.cards[i])){
                return this.cards.splice(i, 1)[0]
            }
        }
        return undefined
    }
}
