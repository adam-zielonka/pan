import { Board } from '../board'
import { Player } from './player'

export class PlayerAI extends Player {
    public play(board: Board) {
        let success = false
        if (board.isActionAvailable(this.cards[0], this.id)) {
          const comboActions = this.getFigureActions(board.getStack().length)
            if (comboActions.length && comboActions[0] === this.cards[0].getValue() &&
              board.isComboActionAvailable(this.cards[0].getValue(), this.id)) {
              board.setComboMode(this.cards[0].getValue(), true)
            } else {
              board.action(this.cards[0])
            }
            success = true
        } else if (board.isActionAvailable(this.cards[this.cards.length - 1], this.id)) {
            if (this.cards[this.cards.length - 1].getValue() < this.cards[0].getValue() + 4) {
                board.action(this.cards[this.cards.length - 1])
                success = true
            }
        }
        if (!success) { board.getFromStack() }
    }
}
