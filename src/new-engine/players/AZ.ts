import { Card } from '../Card'
import { Deck } from '../Deck'
import { Action, ActionName, Game } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

const LEVEL = 4

type Result = {
  action: ActionName
  points: number
}

export class AZ extends Player {
  type = PlayerType.AZ
  maxPoints = Deck.generate().reduce((p, c) => this.formula(p, c), 0)

  formula(points: number, card: Card): number {
    return points + 15 - card.figure
  }

  percentComplete(game: Game): number {
    const points =
      game.players[this.id].cards.reduce((p, c) => this.formula(p, c), 0) || 0
    return 1 - points / this.maxPoints
  }

  getAllPossibleStates(game: Game, level = 0): Result[] {
    const results: Result[] = []

    for (const action of game.getPossibleActions(game.players[game.token])) {
      const testGame = new Game(game)
      const player = testGame.players[testGame.token]
      player.makeAction(testGame, action[0])
      testGame.setNextPlayer()

      let percent
      if (level === LEVEL) {
        percent = this.percentComplete(testGame)
      } else {
        percent = 1 - this.getAllPossibleStates(testGame, level + 1)[0].points
      }
      results.push({
        action: action[0],
        points: percent,
      })
    }

    return results.sort((a, b) => b.points - a.points)
  }

  printResult(results: Result[]): void {
    for (const { action, points } of results) {
      let style
      if (action === 'stack' || action === 'skip') {
        style = `color: blue; background-color: white`
      } else {
        style = `color: ${action.colorStyle}; background-color: white`
      }

      console.log(
        `%c#${this.idText} ${this.type}%c - ${
          Math.round(points * 10000) / 100
        }% - %c ${action.toString()} `,
        `font-weight: bold`,
        `font-weight: normal`,
        style,
      )
    }
  }

  play(game: Game, actions: Action[]): Action {
    if (actions.length === 1) {
      return actions[0]
    }

    const result = this.getAllPossibleStates(game)
    this.printResult(result)

    const bestAction = actions.find(([name]) => name === result[0].action)
    return bestAction || actions[0]
  }
}
