import { Player } from '../Player'
import { PlayerType } from '../PlayerType'

export class NonePlayer extends Player {
  type = PlayerType.None
  play(): void {
    return
  }
}
