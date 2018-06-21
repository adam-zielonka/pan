import * as React from 'react'
import './Pan.css'

import { Button } from 'reactstrap'
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
          Deck: {this.deck.map(card => ( 
            <DrawCard card={card} />
          ))}
        </div>
        <div>
            Token: Player {this.board.getToken() + 1}
        </div>
        <ol className="players">
          {this.board.getPlayers().map(player => (
            <li>
              {player.getCards().map(card => (
                <DrawCard 
                  card={card} 
                  active={this.board.isActionAvalible(card, player.getID())} 
                />
              ))}
            </li>
          ))}
        </ol>
        <div className="stack">
          Stack: {this.board.getStack().map(card => ( 
            <DrawCard card={card} />
          ))}
            <Button color="light" hidden={!(this.board.getStack().length > 1)} 
              className={"onecard ml-1 mt-1"} >
              Get cards
            </Button>
        </div>
      </div>
    )
  }

}

interface ICardProps {
  active? : boolean
  card : Card
}

function DrawCard(props : ICardProps) {
  return (
    <Button color="light" disabled={!props.active} 
      className={"onecard ml-1 mt-1 " + (props.card.getColorStyle())} >
      {props.card.toString()}
    </Button>
  )
}