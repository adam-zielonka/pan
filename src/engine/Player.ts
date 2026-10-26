import type { Card } from './Card'
import type { Game, Action, ActionName } from './Game'
import { PlayerType } from './PlayerType'

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

  playWrapper(game: Game): ReturnType<typeof setTimeout> | undefined {
    if (
      game.isSimulation ||
      this.type === PlayerType.Human ||
      this.type === PlayerType.None
    )
      return

    return setTimeout(() => {
      const action = this.play(game, game.getPossibleActions(this))

      if (action) {
        this.action(action)
      }
    }, game.thinkDelay)
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
    player.type = this.type
    return player
  }

  private action(action: Action): void {
    action[1]()
  }
}

class PlayerClone extends Player {
  type = PlayerType.None
  play(): void {
    return
  }
}
