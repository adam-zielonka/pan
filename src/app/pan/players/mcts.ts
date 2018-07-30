import { Board } from '../board'
import { Player } from './player'
import { Card } from '../card'

class State {
  board: Board
  playerNo: Number
  visitCount: Number
  winScore: Number

  constructor(board: Board) {
    this.board = new Board(board)
  }

  public getAllPossibleStates(): State[] {
    const states: State[] = []
    for (const card of this.board.getPosibleActions()) {
      const state = new State(this.board)
      state.board.action(card)
      states.push(state)
    }
    for (const figure of this.board.getPosibleComboActions()) {
      const state = new State(this.board)
      state.board.setComboMode(figure, true)
      states.push(state)
    }
    if (this.board.getStack().length > 1) {
      const state = new State(this.board)
      state.board.getFromStack()
      states.push(state)
      console.log(state.board)
    }
    return states
  }

  public randomPlay() {
      /* get a list of all possible positions on the board and
         play a random move */
  }
}

class Node {
  state: State
  parent: Node
  childArray: Node[]
}

class Tree {
  root: Node
}

export class MCTS extends Player {
    public play(board: Board) {
      const s = new State(board)

      console.log(s.getAllPossibleStates())

    }
}
