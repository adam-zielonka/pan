import { Card } from './Card'

export class Board {
  constructor(readonly stack: Card[] = []) {}

  get numberOfCardsThatCanBeGetFromStack(): number {
    switch (this.stack.length) {
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
    return this.stack.splice(
      this.stack.length - this.numberOfCardsThatCanBeGetFromStack,
      this.numberOfCardsThatCanBeGetFromStack,
    )
  }

  putCardOnStack(card: Card): void {
    if (this.isPossibleToPutCardOnStack(card)) {
      this.stack.push(card)
    }
  }

  isPossibleToPutCardOnStack(card: Card): boolean {
    if (this.stack.length === 0) {
      return card.isStartCard
    }
    const lastCard = this.stack[this.stack.length - 1]
    return card.compareFigures(lastCard) >= 0
  }

  isPossibleToGetCardFromStack(): boolean {
    return this.numberOfCardsThatCanBeGetFromStack > 0
  }
}
