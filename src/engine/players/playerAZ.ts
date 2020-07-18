import { Board } from '../board'
import { Player } from './player'
import { Card } from '../card'
import { printPlayer } from '../utils'

const LEVEL = 4

enum Action {
  play1 = 'action',
  play4 = 'setComboMode',
  getFromStack = 'getFromStack'
}

class Result {
  type: Action
  card: Card
  points: number

  constructor(points: number, type: Action, card: Card = null) {
    this.type = type
    this.card = card
    this.points = points
  }
}

export class PlayerAZ extends Player {

  public getAllPossibleStates(board: Board, level: number = 0): Result[] {
    const states: Result[] = []
    for (const card of board.getPossibleActions()) {
      const testBoard = new Board(board)
      testBoard.action(card)
      let procent
      if (level === LEVEL) {
        procent = testBoard.procentComplete(this.id)
      } else {
        procent = 1 - this.getAllPossibleStates(testBoard, level + 1)[0].points
      }
      states.push(new Result(procent, Action.play1, card))
    }
    for (const figure of board.getPossibleComboActions()) {
      const testBoard = new Board(board)
      testBoard.setComboMode(figure, true)
      let procent
      if (level === LEVEL) {
        procent = testBoard.procentComplete(this.id)
      } else {
        procent = 1 - this.getAllPossibleStates(testBoard, level + 1)[0].points
      }
      states.push(new Result(procent, Action.play4, new Card(figure, null)))
    }
    if (board.getStack().length > 1) {
      const testBoard = new Board(board)
      testBoard.getFromStack()
      let procent
      if (level === LEVEL) {
        procent = 1 - testBoard.procentComplete(this.id)
      } else {
        procent = this.getAllPossibleStates(testBoard, level + 1)[0].points
      }
      states.push(new Result(procent, Action.getFromStack))
    }
    if (level === 0) {
      return states.sort((a, b) => {
        switch (true) {
        case a.points > b.points: return -1
        case a.points < b.points: return 1
        default: return 0
        }
      })
    } else {
      return [states.reduce((a, b) => a.points < b.points ? a : b)]
    }
  }

  public play(board: Board) {
    printPlayer(this.id, 'AZ')
    const result = this.getAllPossibleStates(board)
    console.log(result)
    switch (result[0].type) {
    case Action.play1:
      board.action(result[0].card)
      break
    case Action.play4:
      board.setComboMode(result[0].card.getValue(), true)
      break
    default:
      board.getFromStack()
      break
    }
  }
}
