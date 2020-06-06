import { Board } from '../board'
import { Player } from './player'
import { Figure, Color } from '../card'

export class PlayerRandom extends Player {

    public getRandom(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    public play(board: Board) {
        console.log('random')
        const actions = board.getPosibleActions()
        const comboActions = board.getPosibleComboActions()
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
            if (actions.length && actions[0].getValue() === Figure.f9 && actions[0].getColor() === Color.Kier) {
              board.action(actions[0])
            } else {
              board.getFromStack()
            }
            break
        }
    }
}
