import { Component, OnInit, Input, PlatformRef } from '@angular/core'
import { Card, Figure, Deck, Color } from './card'
import { Board } from './board'
import { MCTS } from './players/mcts'
import { Player } from './players/player'

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
    for (let i = 0; i < players; i++) {
      this.board.addPlayer(ai ? new MCTS() : new Player())
    }
    this.board.dealingCards(this.deck.map(card => card))
  }

  ngOnInit() {
    this.players = 3
    this.ai = true
    this.newGame(this.players, this.ai)
  }

}
