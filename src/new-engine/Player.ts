import { Card } from './Card'
import { Game, PossibleAction } from './Game'
import { PlayerType } from './PlayersSelect'

export abstract class Player {
  cards: Card[] = []
  abstract type: PlayerType

  constructor(readonly id: number) {}

  get idText(): string {
    return `${this.id + 1}`
  }

  get isPlaying(): boolean {
    return this.cards.length > 0
  }

  abstract play(game: Game, actions: PossibleAction[]): PossibleAction | void

  playWrapper(game: Game): void {
    const possibleActions = game.getPossibleActions(this)
    this.printPossibleActions(possibleActions)

    const action = this.play(game, possibleActions)

    if (action) {
      this.printPlayedAction(action)
      action[1]()
    }
  }

  addCard(card: Card): void {
    const index = this.cards.findIndex(_card => card.compare(_card) === -1)
    if (index !== -1) {
      this.cards.splice(index, 0, card)
    } else {
      this.cards.push(card)
    }
  }

  pop(card: Card): Card | undefined {
    const index = this.cards.findIndex(_card => card.compare(_card) === 0)
    if (index !== -1) {
      return this.cards.splice(index, 1)[0]
    }
  }

  printPossibleActions(actions: PossibleAction[]): void {
    console.log(
      `#${this.idText} ${this.type}'s possible actions: ${actions
        .map(a => a[0].toString())
        .join(' ')}`,
    )
  }

  printPlayedAction(action: PossibleAction): void {
    console.log(`#${this.idText} ${this.type} played ${action[0].toString()}`)
  }
}
