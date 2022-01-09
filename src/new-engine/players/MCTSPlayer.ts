import { Card } from '../Card'
import { Deck } from '../Deck'
import { Action, ActionName, Game } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

class State {
  game: Game
  visitCount: number
  winScore: number

  constructor(game: Game, public action?: ActionName) {
    this.game = new Game(game)
    this.action = action
    this.visitCount = 0
    this.winScore = 0
  }

  getAllPossibleStates(): (() => State)[] {
    const states = []
    for (const [actionName] of this.game.getPossibleActions(
      this.game.players[this.game.token],
    )) {
      const fun = (): State => {
        const state = new State(this.game, actionName)
        const player = this.game.players[this.game.token]
        player.makeAction(this.game, actionName)
        this.game.setNextPlayer()
        return state
      }
      states.push(fun)
    }
    return states
  }

  randomPlay(): void {
    const states = this.getAllPossibleStates()
    const random = Math.floor(Math.random() * states.length)
    this.game = states[random]().game
  }
}

class Node {
  state: State
  parent?: Node
  childArray: Node[]

  constructor(state: State) {
    this.state = state
    this.childArray = []
  }

  getRandomChildNode(): Node {
    const random = Math.floor(Math.random() * this.childArray.length)
    return this.childArray[random]
  }

  getUTC(parentVisit: number): number {
    return UCT.uctValue(parentVisit, this.state.winScore, this.state.visitCount)
  }

  getChildWithMaxScore(): Node {
    return this.childArray.reduce((a, b) => {
      return a.state.visitCount >= b.state.visitCount ? a : b
    })
  }

  printPoints(): void {
    for (const node of this.childArray) {
      if (!node.state.action) {
        continue
      }

      let style
      if (node.state.action === 'stack' || node.state.action === 'skip') {
        style = `color: blue; background-color: white`
      } else {
        style = `color: ${node.state.action.colorStyle}; background-color: white`
      }

      console.log(
        `- ${Math.round((node.state.winScore * 100) / 10) / 100}/${
          node.state.visitCount
        } - %c ${node.state.action.toString()} `,
        style,
      )
    }
  }
}

class Tree {
  root: Node

  constructor(game: Game) {
    this.root = new Node(new State(game))
  }

  print(): void {
    console.log(this.root)
  }
}

class UCT {
  static uctValue(totalVisit: number, nodeWinScore: number, nodeVisit: number): number {
    if (nodeVisit === 0) {
      return Number.MAX_VALUE
    }
    return nodeWinScore / nodeVisit + 1.41 * Math.sqrt(Math.log(totalVisit) / nodeVisit)
  }

  static findBestNodeWithUCT(node: Node): Node {
    const parentVisit = node.state.visitCount
    return node.childArray.reduce((a, b) => {
      return a.getUTC(parentVisit) > b.getUTC(parentVisit) ? a : b
    })
  }
}

export class MCTSPlayer extends Player {
  type = PlayerType.MCTS

  selectPromisingNode(root: Node): Node {
    let node = root
    while (node.childArray.length) {
      node = UCT.findBestNodeWithUCT(node)
    }
    return node
  }

  expandNode(node: Node): void {
    const possibleStates = node.state.getAllPossibleStates()
    possibleStates.forEach(state => {
      const newNode = new Node(state())
      newNode.parent = node
      node.childArray.push(newNode)
    })
  }

  maxPoints = Deck.generate().reduce((p, c) => this.formula(p, c), 0)

  formula(points: number, card: Card): number {
    return points + 15 - card.figure
  }

  percentComplete(game: Game): number {
    const points =
      game.players[this.id].cards.reduce((p, c) => this.formula(p, c), 0) || 0
    return 1 - points / this.maxPoints
  }

  simulateRandomPlayOut(node: Node): number {
    let isPlaying = node.state.game.players[this.id].isPlaying
    let isSomeonePlaying = node.state.game.players.some(player => player.isPlaying)
    if (!isPlaying) {
      return isSomeonePlaying ? 10 : 0
    }
    const state = new State(node.state.game)
    let counter = 100
    while (isPlaying && --counter) {
      state.randomPlay()
      isPlaying = node.state.game.players[this.id].isPlaying
    }
    if (!counter) {
      10 * this.percentComplete(state.game)
      return 10 * this.percentComplete(state.game)
    } else {
      isSomeonePlaying = node.state.game.players.some(player => player.isPlaying)
      return isSomeonePlaying ? 10 : 0
    }
  }

  backPropagation(node: Node, score: number): void {
    if (score < 0) {
      return
    }
    let tempNode: Node | undefined = node
    while (tempNode) {
      tempNode.state.visitCount++
      tempNode.state.winScore += score
      tempNode = tempNode.parent
    }
  }

  getResult(game: Game): ActionName | undefined {
    const tree = new Tree(game)

    const actionCount = game.getPossibleActions(game.players[game.token]).length
    let iter = 50 * actionCount
    while (iter--) {
      // 1. Select promising node
      const promisingNode = this.selectPromisingNode(tree.root)
      if (!promisingNode.state.game.isGameOver) {
        this.expandNode(promisingNode)
      }
      // 2. Simulation
      let nodeToExplore = promisingNode
      if (promisingNode.childArray.length > 0) {
        nodeToExplore = promisingNode.getRandomChildNode()
      }
      // 3. Back propagation
      const playOutResult = this.simulateRandomPlayOut(nodeToExplore)
      this.backPropagation(nodeToExplore, playOutResult)
    }
    tree.print()
    const winnerNode = tree.root.getChildWithMaxScore()
    tree.root.printPoints()
    tree.root = winnerNode
    return winnerNode.state.action
  }

  play(game: Game, actions: Action[]): Action {
    if (actions.length === 1) {
      return actions[0]
    }

    const result = this.getResult(game)

    if (!result) {
      return actions[0]
    }

    const bestAction = actions.find(([name]) => name === result)
    return bestAction || actions[0]
  }
}
