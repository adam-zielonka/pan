import { Component, OnInit, Input, PlatformRef, SimpleChange } from '@angular/core'
import { Card, Figure, Deck, Color } from './card'
import { Board } from './board'
import { MCTS } from './players/mcts'
import { Player } from './players/player'
import { PlayerAI } from './players/simple.ai'

enum PlayersTypes {
  Human = 'Human',
  SimpleAI = 'Simple.AI',
  MCTS = 'MCTS'
}

class CPlayersTypes {
  type: PlayersTypes = PlayersTypes.SimpleAI
}

@Component({
  selector: 'app-pan-game',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css']
})
export class PanComponent implements OnInit {

  public board: Board
  public deck: Card[]
  @Input() players: number
  @Input() ai: boolean
  @Input() playersList: CPlayersTypes[]
  public playersTypes = [
    PlayersTypes.Human,
    PlayersTypes.SimpleAI,
    PlayersTypes.MCTS
  ]

  constructor() {}

  public numberToFigure(figure: Figure): String {
    return Card.numberToFigure(figure)
  }

  public newGameClick() {
    this.newGame(this.players, this.ai)
  }

  public newGame(players: number, ai: boolean) {
    if (this.board) {
      this.board.stop()
    }
    this.deck = Deck.generate()
    this.deck = Deck.shuffle(this.deck)
    this.board = new Board()
    console.log(this.playersList)
    for (let i = 0; i < players; i++) {
      switch (this.playersList[i].type) {
        case PlayersTypes.SimpleAI:
          this.board.addPlayer(new PlayerAI())
          break
        case PlayersTypes.MCTS:
          this.board.addPlayer(new MCTS())
          break
        default:
        this.board.addPlayer(new Player())
          break
      }
    }
    this.board.dealingCards(this.deck.map(card => card))
  }

  public setPlayersTypes() {
    this.playersList = []
    for (let i = 0; i < 24; i++) {
      this.playersList.push(new CPlayersTypes())
    }
  }

  ngOnInit() {
    this.players = 3
    this.setPlayersTypes()
    this.ai = true
    this.newGame(this.players, this.ai)
  }

}
