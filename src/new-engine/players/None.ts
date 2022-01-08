import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

export class None extends Player {
  type = PlayerType.None
  play(): void {
    // noting to do
  }
}
