import { Board } from '../board'
import { Player } from './player'
import { Card } from '../card'

class State {
  board: Board
  playerNo: number
  visitCount: number
  winScore: number
  states: State[]

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
    // if (!this.states) { this.states = this.getAllPossibleStates() }
    // const random = Math.floor(Math.random() * this.states.length)

  }
}

class Node {
  state: State
  parent: Node
  childArray: Node[]

  constructor(board: Board) {
    this.state = new State(board)
    this.childArray = []
  }

  getRandomChildNode(): Node {
    return null
  }

  compare(node: Node, parentVisit): number {
    const a = UCT.uctValue(parentVisit, this.state.winScore, this.state.visitCount)
    const b = UCT.uctValue(parentVisit, node.state.winScore, node.state.visitCount)
    switch (true) {
      case a > b: return 1
      case a < b: return -1
      default: return 0
    }
  }
}

class Tree {
  root: Node

  constructor(board: Board) {
    this.root = new Node(board)
  }
}

class UCT {
  public static uctValue(totalVisit: number, nodeWinScore: number, nodeVisit: number): number {
      if (nodeVisit === 0) { return Number.MAX_SAFE_INTEGER }
      return nodeWinScore / nodeVisit + 1.41 * Math.sqrt(Math.log(totalVisit) / nodeVisit)
  }

  public static findBestNodeWithUCT(node: Node): Node {
      const parentVisit = node.state.visitCount
      node.childArray.sort((a, b) => a.compare(b, parentVisit))
      if (node.childArray.length) {
        return node.childArray[0]
      }
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
    // TODO
  }

  public simulateRandomPlayout(node: Node): number {
    // TODO
    return null
  }

  public backPropogation(node: Node, playerID: number) {
    // TODO
  }

  public play(board: Board) {
    const tree = new Tree(board)

    let count = 1000
    while (count--) {
      // 1. Select promising node
      const promisingNode = this.selectPromisingNode(tree.root)
      if (promisingNode.state.board.playersStillPlay() > 1) {
        this.expandNode(promisingNode)
      }
      // 2. Symulation
      let nodeToExplore = promisingNode
      if (promisingNode.childArray.length > 0) {
        nodeToExplore = promisingNode.getRandomChildNode()
      }
      // 3. Back propagation
      const playoutResult = this.simulateRandomPlayout(nodeToExplore)
      this.backPropogation(nodeToExplore, playoutResult)
    }

    // TODO
  }
}
