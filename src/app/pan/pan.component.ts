import { Component, OnInit, Input, PlatformRef } from '@angular/core'
import { Card, Figure, Deck, Color } from './card'
import { GameData, PanService } from './pan.service'

@Component({
  selector: 'app-pan-game',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css']
})
export class PanComponent implements OnInit {

  public data: GameData
  @Input() players: number
  @Input() ai: boolean

  constructor(private panService: PanService) {}

  public numberToFigure(figure: Figure): String {
    return Card.numberToFigure(figure)
  }

  public newGameClick() {
    this.newGame()
  }

  public newGame() {
    this.panService.newGame(this.players, this.ai).subscribe(data => this.data = data)
  }

  public action(card: Card) {
    this.panService.action(card)
  }

  public actionStart() {
    this.panService.action(new Card(Figure.f10, Color.Kier))
  }

  public getFromStack() {

  }

  public setComboMode() {

  }

  public isActionAvalible(card: Card, playerID: number) {
    if (this.data.comboMode) {
      return this.data.stack.length
        ? this.data.comboMode === card.getValue()
        : this.data.startCard.isEqual(card)
    }
    if (this.data.stack[this.data.stack.length - 1]) {
        return (this.data.data.token === playerID) && (this.data.stack[this.data.stack.length - 1].compare(card) !== 1)
    }
    return this.data.startCard.isEqual(card)
  }

  public getFigureActions(cards): Figure[] {
    const figureActions: Figure[] = []
    let figure: Figure = Figure.f9
    let count = this.data.stack.length ? 1 : 0
    for (const card of cards) {
        if (card.getValue() === figure) {
            count++
            if (count === 4) { figureActions.push(figure) }
        } else {
            figure = card.getValue()
            count = 1
        }
    }
    return figureActions
  }

  public isComboActionAvalible(figure: Figure, playerID: number) {
    if (this.data.comboMode) { return false }
    if (this.data.data.token !== playerID) { return false }
    if (this.data.stack.length) { return this.data.stack[this.data.stack.length - 1].compare(new Card(figure, null)) !== 1 }
    return figure === 9
  }

  ngOnInit() {
    this.players = 3
    this.ai = true
    this.newGame()
  }

}
