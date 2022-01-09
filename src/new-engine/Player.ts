import { Card } from './Card'
import { Game, Action, ActionName } from './Game'
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

  abstract play(game: Game, actions: Action[]): Action | void

  playWrapper(game: Game): NodeJS.Timeout | undefined {
    const possibleActions = game.getPossibleActions(this)
    this.printPossibleActions(possibleActions)

    const action = this.play(game, possibleActions)

    if (action) {
      return setTimeout(() => {
        this.action(action)
      }, 1000)
    }
  }

  makeAction(game: Game, name: ActionName): void {
    const action = game.getPossibleActions(this).find(([n]) => n === name)

    if (action) {
      this.action(action)
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

  popCard(card: Card): Card | undefined {
    const index = this.cards.findIndex(_card => card.compare(_card) === 0)
    if (index !== -1) {
      return this.cards.splice(index, 1)[0]
    }
  }

  clone(): PlayerClone {
    const player = new PlayerClone(this.id)
    player.cards = this.cards.slice()
    return player
  }

  private action(action: Action): void {
    this.printPlayedAction(action)
    action[1]()
  }

  protected printPossibleActions(actions: Action[]): void {
    const log = []
    const styles = []
    for (const [name] of actions) {
      log.push(`%c${name.toString()}`)
      if (name === 'stack' || name === 'skip') {
        styles.push(`color: blue; background-color: white`)
      } else {
        styles.push(`color: ${name.colorStyle}; background-color: white`)
      }
    }

    console.log(
      `%c#${this.idText} ${this.type}'s%c possible actions: %c ${log.join(' ')} `,
      `font-weight: bold`,
      `font-weight: normal`,
      `background-color: white`,
      ...styles,
    )
  }

  protected printPlayedAction(action: Action): void {
    let style = 'color: unset'
    if (action[0] === 'stack' || action[0] === 'skip') {
      style = `color: blue; background-color: white`
    } else {
      style = `color: ${action[0].colorStyle}; background-color: white`
    }

    console.log(
      `%c#${this.idText} ${this.type}%c played %c ${action[0].toString()} `,
      `font-weight: bold`,
      `font-weight: normal`,
      style,
    )
  }
}

class PlayerClone extends Player {
  type = PlayerType.None
  play(): void {
    return
  }

  protected printPlayedAction(): void {
    // do nothing
  }

  protected printPossibleActions(): void {
    // do nothing
  }
}
