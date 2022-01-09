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

  playWrapper(game: Game): NodeJS.Timeout | undefined {
    const possibleActions = game.getPossibleActions(this)
    this.printPossibleActions(possibleActions)

    const action = this.play(game, possibleActions)

    if (action) {
      return setTimeout(() => {
        this.printPlayedAction(action)
        action[1]()
      }, 1000)
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
    const log = []
    const styles = []
    for (const [name] of actions) {
      log.push(`%c${name.toString()}`)
      if (name === 'stack' || name === 'skip') {
        styles.push(`color: unset`)
        continue
      }

      styles.push(`color: ${name.colorStyle === 'red' ? 'red' : 'unset'}`)
    }

    console.log(
      `%c#${this.idText} ${this.type}'s%c possible actions: ${log.join(' ')}`,
      `font-weight: bold`,
      `font-weight: normal`,
      ...styles,
    )
  }

  printPlayedAction(action: PossibleAction): void {
    let style = 'color: unset'
    if (action[0] !== 'stack' && action[0] !== 'skip' && action[0].colorStyle === 'red') {
      style = 'color: red'
    }

    console.log(
      `%c#${this.idText} ${this.type}%c played %c${action[0].toString()}`,
      `font-weight: bold`,
      `font-weight: normal`,
      style,
    )
  }
}
