import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

export class Human extends Player {
  type = PlayerType.Human
  play(): void {
    return
  }
}
