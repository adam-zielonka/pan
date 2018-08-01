import { Card, Figure } from '../card'
import { Board, IPlayer } from '../board'

export class Player implements IPlayer {
    protected cards: Card[] = []
    protected id: number

    public getID(): number {
        return this.id
    }
    public setID(id: number) {
        this.id = id
    }
    public getCards(): Card[] {
        return this.cards
    }

    public setCards(cards: Card[]) {
      this.cards = cards
    }

    public sortCards() {
        this.cards.sort((a, b) => a.compare(b))
    }

    public action(actionCard: Card): Card {
        for (let i = 0; i < this.cards.length; i++) {
            if (actionCard.isEqual(this.cards[i])) {
                return this.cards.splice(i, 1)[0]
            }
        }
        return undefined
    }

    public getFigureActions(isStackEmpty): Figure[] {
        this.sortCards()
        const figureActions: Figure[] = []
        let figure: Figure = Figure.f9
        let count = isStackEmpty ? 1 : 0
        for (const card of this.cards) {
            if (card.getValue() === figure) {
                count++
                if (count === 4) { figureActions.push(figure) }
            } else {
                figure = card.getValue()
                count = 1
            }
        }
        return figureActions
    }

    public play(board: Board) {
      console.log('Human')
    }
}
