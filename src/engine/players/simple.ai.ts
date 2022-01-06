import { Board } from '../board'
import { Player } from './player'
import { printPlayer } from '../utils'

export class PlayerAI extends Player {
  public play(board: Board) {
    printPlayer(this.id, 'simple.ai')
    let success = false
    if (board.isActionAvailable(this.cards[0], this.id)) {
      const comboActions = this.getFigureActions(!!board.getStack().length)
      if (
        comboActions.length &&
        comboActions[0] === this.cards[0].figure &&
        board.isComboActionAvailable(this.cards[0].figure, this.id)
      ) {
        board.setComboMode(this.cards[0].figure, true)
      } else {
        board.action(this.cards[0])
      }
      success = true
    } else if (board.isActionAvailable(this.cards[this.cards.length - 1], this.id)) {
      if (this.cards[this.cards.length - 1].figure < this.cards[0].figure + 4) {
        board.action(this.cards[this.cards.length - 1])
        success = true
      }
    }
    if (!success) {
      board.getFromStack()
    }
  }
}
