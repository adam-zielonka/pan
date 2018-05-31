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

    public getFigureActions(isStackEmpty) : Figure[] {
        this.sortCards()
        var figureActions : Figure[] = []
        var figure : Figure = Figure.f9
        var count = isStackEmpty ? 1 : 0
        for (const card of this.cards) {
            if(card.getValue() == figure) {
                count++
                if(count == 4) figureActions.push(figure)
            } else {
                figure = card.getValue()
                count = 1
            }
        }
        return figureActions
    }
}
