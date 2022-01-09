import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

export class HumanPlayer extends Player {
  type = PlayerType.Human
  play(): void {
    return
  }
}
