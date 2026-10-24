import { Player } from '../Player'
import { PlayerType } from '../PlayerType'

export class HumanPlayer extends Player {
  type = PlayerType.Human
  play(): void {
    return
  }
}
