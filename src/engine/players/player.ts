import { Card, Figure } from '../card'
import { Board, IPlayer } from '../board'
import { printPlayer } from '../utils'

export class Player implements IPlayer {
  private _cards: Card[]
  private _id: number

  constructor(id: number, cards: Card[] = []) {
    this._id = id
    this._cards = cards
  }

  get idText(): number {
    return this.id + 1
  }

  get cards(): Card[] {
    return this._cards
  }

  get id(): number {
    return this._id
  }

  copy(): IPlayer {
    return new Player(
      this.id,
      this.cards.map(card => card),
    )
  }

  addCard(card: Card): void {
    const index = this._cards.findIndex(_card => card.compareColors(_card) === -1)
    if (index !== -1) {
      this._cards.splice(index, 0, card)
    } else {
      this._cards.push(card)
    }
  }

  action(actionCard: Card): Card | undefined {
    for (let i = 0; i < this.cards.length; i++) {
      if (actionCard.isEqual(this.cards[i])) {
        return this.cards.splice(i, 1)[0]
      }
    }
    return undefined
  }

  getFigureActions(isStackEmpty: boolean): Figure[] {
    const figureActions: Figure[] = []
    let figure: Figure = Figure.f9
    let count = isStackEmpty ? 1 : 0
    for (const card of this.cards) {
      if (card.figure === figure) {
        count++
        if (count === 4) {
          figureActions.push(figure)
        }
      } else {
        figure = card.figure
        count = 1
      }
    }
    return figureActions
  }

  play(board: Board): void {
    console.log(`Board: `, board)
    printPlayer(this.id, 'Human')
  }
}
