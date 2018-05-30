import { Component, OnInit } from '@angular/core';
import { Card } from './card'

@Component({
  selector: 'app-pan',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css']
})
export class PanComponent implements OnInit {

  public deck : Card[]

  constructor() { 
    
  }

  ngOnInit() {
    this.deck = Card.generateDeck()
  }

}
