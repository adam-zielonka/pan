import { Card } from './Card'

export class Board {
  stack: Card[] = []

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
    const cards = this.stack.splice(
      this.stack.length - this.numberOfCardsThatCanBeGetFromStack,
      this.numberOfCardsThatCanBeGetFromStack,
    )
    return cards
  }
}
