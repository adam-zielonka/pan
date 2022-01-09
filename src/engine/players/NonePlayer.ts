import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

export class NonePlayer extends Player {
  type = PlayerType.None
  play(): void {
    return
  }
}
