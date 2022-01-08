import { Card } from './Card'

export class Stack extends Array<Card> {
  get numberOfCardsThatCanBeGetFromStack(): number {
    switch (this.length) {
      case 0:
      case 1:
        return 0
      case 2:
        return 1
      case 3:
        return 2
      default:
        return 3
    }
  }

  getFromStack(): Card[] {
    return this.splice(
      this.length - this.numberOfCardsThatCanBeGetFromStack,
      this.numberOfCardsThatCanBeGetFromStack,
    )
  }

  putCardOnStack(card: Card): void {
    if (this.isPossibleToPutCardOnStack(card)) {
      this.push(card)
    }
  }

  isPossibleToPutCardOnStack(card: Card): boolean {
    if (this.length === 0) {
      return card.isStartCard
    }
    const lastCard = this[this.length - 1]
    return card.compareFigures(lastCard) >= 0
  }

  isPossibleToGetCardFromStack(): boolean {
    return this.numberOfCardsThatCanBeGetFromStack > 0
  }
}
