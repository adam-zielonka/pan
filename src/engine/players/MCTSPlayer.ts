import { Figure } from '../Card'
import { Action, ActionName, Game } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

class State {
  game: Game
  visitCount: number
  winScore: number

  constructor(game: Game, public action?: ActionName) {
    this.game = new Game(game)
    this.visitCount = 0
    this.winScore = 0
  }

  getAllPossibleStates(): State[] {
    const possibleStates: State[] = []
    const availableActions = this.game.getPossibleActions(
      this.game.players[this.game.token],
    )
    availableActions.forEach(action => {
      const state = new State(this.game, action[0])
      const player = this.game.players[this.game.token]
      player.makeAction(this.game, action[0])
      this.game.setNextPlayer()
      possibleStates.push(state)
    })
    return possibleStates
  }

  randomPlay(): void {
    const states = this.getAllPossibleStates()
    const random = Math.floor(Math.random() * states.length)
    this.game = states[random].game
    this.game.setNextPlayer()
  }
}

class Node {
  state: State
  parent?: Node
  childArray: Node[]

  constructor(state: State, parent?: Node, childArray?: Node[]) {
    this.state = state
    this.childArray = childArray || []
    this.parent = parent
  }

  getRandomChildNode(): Node {
    const random = Math.floor(Math.random() * this.childArray.length)
    return this.childArray[random]
  }

  getChildWithMaxScore(): Node {
    return this.childArray.reduce((a, b) => {
      return a.state.visitCount >= b.state.visitCount ? a : b
    })
  }

  clone(): Node {
    const node = new Node(this.state)
    node.childArray = this.childArray.map(child => child.clone())
    return node
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
        `- ${node.state.winScore}/${node.state.visitCount} - ${Math.round(
          (node.state.winScore / node.state.visitCount) * 100,
        )}% - %c ${node.state.action.toString()} `,
        style,
      )
    }
  }
}

class Tree {
  root: Node
  constructor(root: Node) {
    this.root = root
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
      return this.uctValue(parentVisit, a.state.winScore, a.state.visitCount) >=
        this.uctValue(parentVisit, b.state.winScore, b.state.visitCount)
        ? a
        : b
    })
  }
}

export class MCTSPlayer extends Player {
  type = PlayerType.MCTS
  level = 3

  findNextMove(game: Game): ActionName | undefined {
    const rootNode = new Node(new State(game))
    const tree = new Tree(rootNode)

    const actionCount = game.getPossibleActions(game.players[game.token]).length
    let iter = 50 * actionCount
    while (iter--) {
      // Phase 1: Selection
      const promisingNode = this.selectPromisingNode(rootNode)
      // Phase 2: Expansion
      if (!promisingNode.state.game.isGameOver) {
        this.expandNode(promisingNode)
      }
      // Phase 3: Simulation
      let nodeToExplore = promisingNode
      if (promisingNode.childArray.length > 0) {
        nodeToExplore = promisingNode.getRandomChildNode()
      }
      const playoutResult = this.simulateRandomGame(nodeToExplore)
      // Phase 4: Update
      this.backPropagation(nodeToExplore, playoutResult)
    }

    const winnerNode = rootNode.getChildWithMaxScore()
    tree.root.printPoints()
    return winnerNode.state.action
  }

  selectPromisingNode(rootNode: Node): Node {
    let node = rootNode
    while (node.childArray.length !== 0) {
      node = UCT.findBestNodeWithUCT(node)
    }
    return node
  }

  expandNode(node: Node): void {
    const possibleStates = node.state.getAllPossibleStates()
    possibleStates.forEach(state => {
      const newNode = new Node(state, node)
      node.childArray.push(newNode)
    })
  }

  backPropagation(nodeToExplore: Node, playoutResult: number): void {
    let tempNode: Node | undefined = nodeToExplore
    while (tempNode) {
      tempNode.state.visitCount++
      tempNode.state.winScore += playoutResult
      tempNode = tempNode.parent
    }
  }

  simulateRandomGame(node: Node): number {
    const tempNode = node.clone()
    const tempState = tempNode.state
    let isPlaying = tempState.game.players[this.id].isPlaying
    let othersPlaying = tempState.game.players
      .filter(p => p.id !== this.id)
      .some(player => player.isPlaying)

    let counter = 100
    while (isPlaying && --counter) {
      tempState.randomPlay()
      isPlaying = tempState.game.players[this.id].isPlaying
      othersPlaying = tempState.game.players
        .filter(p => p.id !== this.id)
        .some(player => player.isPlaying)
    }

    if ((!isPlaying && !othersPlaying) || (isPlaying && !othersPlaying)) {
      return 0
    }

    if (!isPlaying && othersPlaying) {
      return 1
    }

    const player = tempState.game.players[this.id]

    if (player.cards.some(c => [Figure.f9, Figure.f10].includes(c.figure))) {
      return 0
    }

    if (player.cards.some(c => [Figure.J, Figure.Q].includes(c.figure))) {
      return 0.5
    }

    return 1
  }

  play(game: Game, actions: Action[]): Action {
    if (actions.length === 1) {
      return actions[0]
    }

    const result = this.findNextMove(game)

    if (!result) {
      return actions[0]
    }

    const bestAction = actions.find(([name]) => name === result)
    return bestAction || actions[0]
  }
}
