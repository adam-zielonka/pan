import { Component, OnInit, Input } from '@angular/core'
import { Card } from './card'
import { Board } from './board'
import { Player } from './player'
import { Figure } from './figure'
import { Color } from './color'

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
    this.deck = Card.generateDeck()
    this.deck = Card.shuffleDeck(this.deck)
    this.board = new Board()
    for (let i = 0; i < players; i++)
      this.board.addPlayer(new Player(this.ai))
    this.board.dealingCards(this.deck.map(card => card))
  }

  ngOnInit() {
    this.players = 3
    this.ai = true
    this.newGame(this.players)
  }

}
