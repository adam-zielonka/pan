import * as React from 'react'
import './Pan.css'

import { Board } from './board'
import { Card, Figure } from './card'
import { Deck } from './deck'
import { Player, PlayerAI } from './players'


export default class Pan extends React.Component {

  public deck : Card[]
  public board : Board
  public players : number
  public ai : boolean

  public constructor(props : {}) {
    super(props)
    this.players = 3
    this.ai = true
    this.newGame(this.players)
  }

  public numberToFigure(figure : Figure) : string {
    return Card.numberToFigure(figure)
  }

  public newGameClick() {
    this.newGame(this.players)
  }

  public newGame(players : number) {
    this.deck = Deck.generate()
    this.deck = Deck.shuffle(this.deck)
    this.board = new Board()
    for (let i = 0; i < players; i++) {
      this.board.addPlayer(this.ai ? new PlayerAI() : new Player())
    }
    this.board.dealingCards(this.deck.map(card => card))
  }

  public render() {
    return (
      <div>
        <div className="deck">
          Deck: <Cards deck={this.deck} />
        </div>
        <div>
            Token: Player {this.board.getToken() + 1}
        </div>
        <ol className="players">
          {this.board.getPlayers().map(player => (
            <li>
               <Cards deck={player.getCards()} playerID={player.getID()} board={this.board}/>
            </li>
          ))}
        </ol>
        <div className="stack">
          Stack: <Cards deck={this.board.getStack()} />
        </div>
      </div>
    )
  }

}

interface ICardsProps {
  deck : Card[],
  playerID? : number,
  board? : Board
}

class Cards extends React.Component<ICardsProps> {
  public render() {
    const deck = this.props.deck
    const playerID = this.props.playerID
    const board = this.props.board
    if(playerID && board) {
      return (
        <span>
          {deck.map(card => ( 
            <button className={"btn btn-light onecard " + (card.getColorStyle())}>
              {card.toString()}
            </button>
          )) }
        </span>
      )
    }
    return (
      <span>
        {deck.map(card => ( 
          <span className={"btn btn-light disabled onecard " + (card.getColorStyle())}>
            {card.toString()}
          </span>
        )) }
      </span>
    )
  }
}
