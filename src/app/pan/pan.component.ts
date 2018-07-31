import { Component, OnInit, Input, PlatformRef } from '@angular/core'
import { Card, Figure, Deck } from './card'
import { Board } from './board'
import { Player, PlayerAI } from './players'
import { MCTS } from './players/mcts'

@Component({
  selector: 'pan-game',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css']
})
export class PanComponent implements OnInit {

  public deck : Card[]
  public board : Board
  @Input() players : number
  @Input() ai : boolean

  constructor() { 
    
  }

  public numberToFigure(figure : Figure) : String {
    return Card.numberToFigure(figure)
  }

  public newGameClick() {
    this.newGame(this.players)
  }

  public newGame(players : number) {
    this.deck = Deck.generate()
    this.deck = Deck.shuffle(this.deck)
    this.board = new Board()
    for (let i = 0; i < players; i++)
      this.board.addPlayer(this.ai ? new MCTS() : new Player())
    this.board.dealingCards(this.deck.map(card => card))
  }

  ngOnInit() {
    this.players = 3
    this.ai = true
    this.newGame(this.players)
  }

}
