import { Board } from '../board'
import { Player } from './player'
import { Figure, Color } from '../card'
import { printPlayer } from '../utils'

export class PlayerRandom extends Player {
  getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  play(board: Board): void {
    printPlayer(this.id, 'random')
    const actions = board.getPossibleActions()
    const comboActions = board.getPossibleComboActions()
    const random = this.getRandom(0, actions.length + comboActions.length + 1)

    switch (true) {
      case random < actions.length:
        console.log('action')
        board.action(actions[random])
        break
      case random < actions.length + comboActions.length:
        console.log('combo')
        board.setComboMode(comboActions[random - actions.length], true)
        break
      default:
        console.log('stack')
        if (
          actions.length &&
          actions[0].figure === Figure.f9 &&
          actions[0].color === Color.Kier
        ) {
          board.action(actions[0])
        } else {
          board.getFromStack()
        }
        break
    }
  }
}
