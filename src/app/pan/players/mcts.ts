import { Board } from '../board'
import { Player } from './player'
import { Card, Figure } from '../card'

class State {
  board: Board
  playerNo: number
  visitCount: number
  winScore: number
  actionName: string
  actionParam: Card


  constructor(board: Board) {
    this.board = new Board(board)
    this.playerNo = this.board.getToken()
    this.visitCount = 0
    this.winScore = 0
  }

  public getAllPossibleStates(): State[] {
    const states: State[] = []
    for (const card of this.board.getPosibleActions()) {
      const state = new State(this.board)
      state.board.action(card)
      state.actionName = 'action'
      state.actionParam = card
      states.push(state)
    }
    for (const figure of this.board.getPosibleComboActions()) {
      const state = new State(this.board)
      state.board.setComboMode(figure, true)
      state.actionName = 'setComboMode'
      state.actionParam = new Card(figure, null)
      states.push(state)
    }
    if (this.board.getStack().length > 1) {
      const state = new State(this.board)
      state.board.getFromStack()
      state.actionName = 'getFromStack'
      states.push(state)
    }
    return states
  }

  public randomPlay() {
    const states = this.getAllPossibleStates()
    const random = Math.floor(Math.random() * states.length)
    this.board = states[random].board
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

  compare(node: Node, parentVisit): number {
    const a = UCT.uctValue(parentVisit, this.state.winScore, this.state.visitCount)
    const b = UCT.uctValue(parentVisit, node.state.winScore, node.state.visitCount)
    switch (true) {
      case a > b: return 1
      case a < b: return -1
      default: return 0
    }
  }

  getChildWithMaxScore(): Node {
    return this.childArray.reduce((a, b) => {
      return a.state.visitCount >= b.state.visitCount ? a : b
    })
  }
}

class Tree {
  root: Node

  constructor(board: Board) {
    this.root = new Node(new State(board))
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
      return node.childArray[0]
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
        const newNode = new Node(state)
        newNode.parent = node
        node.childArray.push(newNode)
    })
  }

  public simulateRandomPlayout(node: Node): number {
    let status = node.state.board.playersStillPlay() <= 1
    if (status) {
      return node.state.board.getToken()
    }
    const state = new State(node.state.board)
    let counter = 100
    while (!status && counter--) {
        state.randomPlay()
        status = state.board.playersStillPlay() <= 1
    }
    return counter ? state.board.getToken() : -1
  }

  public backPropogation(node: Node, playerID: number) {
    let tempNode = node
    while (tempNode) {
        tempNode.state.visitCount++
        if (tempNode.state.playerNo !== playerID) {
            tempNode.state.winScore++
        }
        tempNode = tempNode.parent
    }
  }

  public getResult(board: Board): Result {
    const tree = new Tree(board)

    let iter = 10
    while (iter--) {
      // 1. Select promising node
      console.log('Loop')
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
    const winnerNode = tree.root.getChildWithMaxScore()
    tree.root = winnerNode
    return {'name' : winnerNode.state.actionName, 'card' : winnerNode.state.actionParam}
  }

  public play(board: Board) {

    const result = this.getResult(board)
    console.log(board.getToken() + ' END')

    switch (result.name) {
      case 'action':
        board.action(result.card)
        break
      case 'setComboMode':
        board.setComboMode(result.card.getValue(), true)
        break
      default:
        board.getFromStack()
        break
    }
    console.log(board.getToken() + ' START')
  }
}

class Result {
  name: String
  card: Card
}
