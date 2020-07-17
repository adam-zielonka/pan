import { Card, Figure } from '../card'
import { Board, IPlayer } from '../board'

export class Player implements IPlayer {
    private _cards: Card[]
    private _id: number

    public constructor(id: number, cards: Card[] = []) {
      this._id = id
      this._cards = cards
    }

    public get cards(): Card[] {
      return this._cards
    }

    public get id(): number {
      return this._id
    }

    public copy(): IPlayer {
      return new Player(this.id, this.cards.map(card => card))
    }

    public addCard(card: Card) {
      const index = this._cards.findIndex(_card => card.compareColors(_card) === -1)
      if (index !== -1) this._cards.splice(index, 0, card)
      else this._cards.push(card)
    }

    public action(actionCard: Card): Card {
      for (let i = 0; i < this.cards.length; i++) {
        if (actionCard.isEqual(this.cards[i])) {
          return this.cards.splice(i, 1)[0]
        }
      }
      return undefined
    }

    public getFigureActions(isStackEmpty: boolean): Figure[] {
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
