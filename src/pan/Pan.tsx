import * as React from 'react'
import './Pan.css'

import { Button } from 'reactstrap'
import { Board } from './board'
import { Card, Figure } from './card'
import { Deck } from './deck'
import { Player, PlayerAI } from './players'

interface IPanState {
  deck : Card[]
  board : Board
  players : number
  ai : boolean
}

export default class Pan extends React.Component<any,IPanState> {

  public constructor(props : {}) {
    super(props)

    this.state = {
      ai : true,
      board : new Board(),
      deck : [],
      players : 3
    }

    this.newGame(this.state.players)
  }

  public numberToFigure(figure : Figure) : string {
    return Card.numberToFigure(figure)
  }

  public newGameClick() {
    this.newGame(this.state.players)
  }

  public newGame(players : number) {
    this.setState({
      deck : Deck.shuffle(Deck.generate()),
      board : new Board()
    })

    for (let i = 0; i < players; i++) {
      this.state.board.addPlayer(this.state.ai ? new PlayerAI() : new Player())
    }
    this.state.board.dealingCards(this.state.deck.map(card => card))
  }

  public render() {
    return (
      <div>
        <div className="deck">
          Deck: {this.state.deck.map(card => ( 
            <DrawCard card={card} />
          ))}
        </div>
        <div>
            Token: Player {this.state.board.getToken() + 1}
        </div>
        <ol className="players">
          {this.state.board.getPlayers().map(player => (
            <li>
              {player.getCards().map(card => (
                <DrawCard 
                  card={card} 
                  active={this.state.board.isActionAvalible(card, player.getID())}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.state.board.action(card)}
                />
              ))}
            </li>
          ))}
        </ol>
        <div className="stack">
          Stack: {this.state.board.getStack().map(card => ( 
            <DrawCard card={card} />
          ))}
            <Button color="light" hidden={!(this.state.board.getStack().length > 1)} 
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
  onClick? : any
}

function DrawCard(props : ICardProps) {
  return (
    <Button color="light" disabled={!props.active} 
      className={"onecard ml-1 mt-1 " + (props.card.getColorStyle())} 
      onClick={props.onClick}>
      {props.card.toString()}
    </Button>
  )
}