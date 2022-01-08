import { Card } from './Card'
import { Stack } from './Stack'

export class Player {
  cards: Card[] = []

  get isPlaying(): boolean {
    return this.cards.length > 0
  }

  play(stack: Stack): void {
    const possibleActions = this.cards.filter(card =>
      stack.isPossibleToPutCardOnStack(card),
    )
    const possibleGetFromStack = stack.isPossibleToGetCardFromStack()
  }

  addCard(card: Card): void {
    const index = this.cards.findIndex(_card => card.compare(_card) === -1)
    if (index !== -1) {
      this.cards.splice(index, 0, card)
    } else {
      this.cards.push(card)
    }
  }
}
