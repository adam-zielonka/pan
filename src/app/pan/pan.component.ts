import { Component, OnInit } from '@angular/core';
import { Card } from './card'
import { Board } from './board';
import { Player } from './player';

@Component({
  selector: 'app-pan',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css']
})
export class PanComponent implements OnInit {

  public deck : Card[]
  public board : Board

  constructor() { 
    
  }

  ngOnInit() {
    this.deck = Card.shuffleDeck(Card.generateDeck())
    this.board = new Board()
    this.board.addPlayer(new Player())
    this.board.addPlayer(new Player())
    this.board.addPlayer(new Player())
    this.board.dealingCards(this.deck.map(card => card))
  }

}
