import { Board } from "../board"
import { Player } from "./player"

export class PlayerAI extends Player {
    public play(board: Board) {
        let sucess = false
        if(board.isActionAvalible(this.cards[0], this.id)) {
            board.action(this.cards[0])
            sucess = true
        } else if(board.isActionAvalible(this.cards[this.cards.length - 1], this.id)){
            // if(this.cards[this.cards.length - 1].getValue() < this.cards[0].getValue() + 4) {
                // board.action(this.cards[this.cards.length - 1])
                // sucess = true
            // }
        }
        if(!sucess) {
            board.getFromStack()
        }
    }
}
