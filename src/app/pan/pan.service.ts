import { Injectable } from '@angular/core'
import { Card, Deck, Figure } from './card'
import { Board, PanData } from './board'
import { Observable, of } from 'rxjs'
import { MCTS } from './players/mcts'
import { Player } from './players/player'

export class GameData {
  public deck: Card[]
  public stack: Card[]
  public players: Card[][]
  public data: PanData
  public comboMode: Figure
  public startCard: Card
}

@Injectable({
  providedIn: 'root'
})
export class PanService {

  public board: Board
  public data: GameData

  constructor() {
    this.data = new GameData()
  }

  public newGame(players: number, ai: boolean): Observable<GameData> {
    if (this.board) {
      this.board.stop()
    }
    this.data.deck = Deck.generate()
    this.data.deck = Deck.shuffle(this.data.deck)
    this.board = new Board()
    for (let i = 0; i < players; i++) {
      this.board.addPlayer(ai ? new MCTS() : new Player())
    }
    this.board.dealingCards(this.data.deck.map(card => card))
    this.data.stack = this.board.getStack()
    this.data.data = this.board.data
    this.data.players = []
    this.data.comboMode = this.board.getComboMode()
    this.data.startCard = this.board.getStartedCard()
    this.board.getPlayers().forEach(player => {
      this.data.players.push(player.getCards())
    })
    return of(this.data)
  }

  public action(card: Card) {
    this.board.action(card)
  }

  public getData() {
    return this.data
  }

}
