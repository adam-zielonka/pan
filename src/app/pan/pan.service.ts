import { Injectable } from '@angular/core'
import { Card, Deck, Figure } from './card'
import { Board } from './board'
import { MCTS, Player } from './players'
import { Observable, of } from 'rxjs'

export class GameData {
  public deck: Card[]
  public stack: Card[]
  public players: Card[][]
  public token: number
  public comboMode: Figure
  public startCard: Card
}

@Injectable({
  providedIn: 'root'
})
export class PanService {

  players: number
  ai: boolean
  public board: Board
  public data: GameData

  constructor() {
    this.players = 3
    this.ai = true
    this.data = new GameData()
    this.newGame(this.players)
  }

  public newGame(players: number): Observable<GameData> {
    this.data.deck = Deck.generate()
    this.data.deck = Deck.shuffle(this.data.deck)
    this.board = new Board()
    for (let i = 0; i < players; i++) {
      this.board.addPlayer(this.ai ? new MCTS() : new Player())
    }
    this.board.dealingCards(this.data.deck.map(card => card))
    this.data.stack = this.board.getStack().map(m => m)
    this.data.token = this.board.getToken()
    this.data.players = []
    this.data.comboMode = this.board.getComboMode()
    this.data.startCard = this.board.getStartedCard()
    this.board.getPlayers().forEach(player => {
      this.data.players.push(player.getCards().map(m => m))
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
