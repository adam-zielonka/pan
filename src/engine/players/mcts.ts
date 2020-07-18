import { Board } from '../board'
import { Player } from './player'
import { Card } from '../card'
import { printPlayer } from '../utils'

enum Action {
  play1 = 'action',
  play4 = 'setComboMode',
  getFromStack = 'getFromStack'
}

class Result {
  type: Action
  card: Card

  constructor(type: Action, card: Card = null) {
    this.type = type
    this.card = card
  }
}

class State {
  board: Board
  playerNo: number
  visitCount: number
  winScore: number
  action: Result

  constructor(board: Board) {
    this.board = new Board(board)
    this.playerNo = this.board.getToken()
    this.visitCount = 0
    this.winScore = 0
  }

  public getAllPossibleStates() {
    const states = []
    for (const card of this.board.getPossibleActions()) {
      const fun = () => {
        const state = new State(this.board)
        state.board.action(card)
        state.action = new Result(Action.play1, card)
        return state
      }
      states.push(fun)
    }
    for (const figure of this.board.getPossibleComboActions()) {
      const fun = () => {
        const state = new State(this.board)
        state.board.setComboMode(figure, true)
        state.action = new Result(Action.play4, new Card(figure, null))
        return state
      }
      states.push(fun)
    }
    if (this.board.getStack().length > 1) {
      const fun = () => {
        const state = new State(this.board)
        state.board.getFromStack()
        state.action = new Result(Action.getFromStack)
        return state
      }
      states.push(fun)
    }
    return states
  }

  public randomPlay() {
    const states = this.getAllPossibleStates()
    const random = Math.floor(Math.random() * states.length)
    this.board = states[random]().board
    this.playerNo = this.board.getToken()
  }
}

class Node {
  state: State
  parent: Node
  childArray: Node[]

  constructor(state: State) {
    this.state = state
    this.childArray = []
  }

  getRandomChildNode(): Node {
    const random = Math.floor(Math.random() * this.childArray.length)
    return this.childArray[random]
  }

  getUTC(parentVisit): number {
    return UCT.uctValue(parentVisit, this.state.winScore, this.state.visitCount)
  }

  getChildWithMaxScore(): Node {
    return this.childArray.reduce((a, b) => {
      return a.state.visitCount >= b.state.visitCount ? a : b
    })
  }

  printPoints() {
    for (const node of this.childArray) {
      // console.log(node)
      const card = node.state.action.card
      console.log(`%c ${card ? card.toString() : 'Stack'} ${Math.round(node.state.winScore * 100 / 10) / 100 }/${node.state.visitCount}`,
        `color: ${card && card.getColorStyle()}`
      )
    }
  }
}


class Tree {
  root: Node

  constructor(board: Board) {
    this.root = new Node(new State(board))
  }

  print() {
    console.log(this.root)
  }
}

class UCT {
  public static uctValue(totalVisit: number, nodeWinScore: number, nodeVisit: number): number {
    if (nodeVisit === 0) { return Number.MAX_VALUE }
    return nodeWinScore / nodeVisit + 1.41 * Math.sqrt(Math.log(totalVisit) / nodeVisit)
  }

  public static findBestNodeWithUCT(node: Node): Node {
    const parentVisit = node.state.visitCount
    return node.childArray.reduce((a, b) => {
      return a.getUTC(parentVisit) > b.getUTC(parentVisit) ? a : b
    })
  }
}

export class MCTS extends Player {

  public selectPromisingNode(root: Node): Node {
    let node = root
    while (node.childArray.length) {
      node = UCT.findBestNodeWithUCT(node)
    }
    return node
  }

  public expandNode(node: Node) {
    const possibleStates = node.state.getAllPossibleStates()
    possibleStates.forEach(state => {
      const newNode = new Node(state())
      newNode.parent = node
      node.childArray.push(newNode)
    })
  }

  public simulateRandomPlayOut(node: Node): number {
    let status = node.state.board.playersStillPlay() <= 1
    if (status) {
      return node.state.board.getToken() !== this.id ? 10 : 0
    }
    const state = new State(node.state.board)
    let counter = 100
    while (!status && --counter) {
      state.randomPlay()
      status = state.board.playersStillPlay() <= 1
    }
    if (!counter) {
      return 10 * state.board.procentComplete(this.id)
    } else {
      return state.board.getToken() !== this.id ? 10 : 0
    }
  }

  public backPropagation(node: Node, score: number) {
    if (score < 0) { return }
    let tempNode = node
    while (tempNode) {
      tempNode.state.visitCount++
      tempNode.state.winScore += score
      tempNode = tempNode.parent
    }
  }

  public getResult(board: Board): Result {
    const tree = new Tree(board)

    let countOfAction = 0
    countOfAction += board.getPossibleActions().length
    countOfAction += board.getPossibleComboActions().length
    countOfAction += board.getStack().length > 1 ? 1 : 0
    let iter = 50 * countOfAction
    while (iter--) {
      // 1. Select promising node
      // console.log('Loop')
      const promisingNode = this.selectPromisingNode(tree.root)
      if (promisingNode.state.board.playersStillPlay() > 1) {
        this.expandNode(promisingNode)
      }
      // 2. Simulation
      let nodeToExplore = promisingNode
      if (promisingNode.childArray.length > 0) {
        nodeToExplore = promisingNode.getRandomChildNode()
      }
      // 3. Back propagation
      const playOutResult = this.simulateRandomPlayOut(nodeToExplore)
      // if (playOutResult === -1) {
      //   console.log(playOutResult)
      // }
      this.backPropagation(nodeToExplore, playOutResult)
    }
    // tree.print()
    const winnerNode = tree.root.getChildWithMaxScore()
    tree.root.printPoints()
    tree.root = winnerNode
    return winnerNode.state.action
  }

  public play(board: Board) {
    // let success = false
    // if (board.isActionAvailable(this.cards[0], this.id)) {
    //   const comboActions = this.getFigureActions(board.getStack().length)
    //     if (comboActions.length && comboActions[0] === this.cards[0].getValue() &&
    //       board.isComboActionAvailable(this.cards[0].getValue(), this.id)) {
    //       board.setComboMode(this.cards[0].getValue(), true)
    //     } else {
    //       board.action(this.cards[0])
    //     }
    //     success = true
    // }
    // if (!success) {
    printPlayer(this.id, 'MCTS')
    console.log('START ' + board.getToken() + ' - ' + (Math.round(board.procentComplete() * 10000) / 100) + '%')
    const result = this.getResult(board)
    console.log('END')

    switch (result.type) {
    case Action.play1:
      board.action(result.card)
      break
    case Action.play4:
      board.setComboMode(result.card.getValue(), true)
      break
    default:
      board.getFromStack()
      break
    }
    // }
  }
}
