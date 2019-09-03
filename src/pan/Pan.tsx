import React from 'react'
import { Card, Figure, Deck, Color } from './card'
import { Board } from './board'
import { MCTS } from './players/mcts'
import { Player } from './players/player'
import { PlayerAI } from './players/simple.ai'
import { PlayerAZ } from './players/playerAZ'
import { PlayerRandom } from './players/random'
import './Pan.css'

enum PlayersTypes {
  Human = 'Human',
  SimpleAI = 'Simple.AI',
  Random = 'Random',
  MCTS = 'MCTS',
  AZ = 'AZ'
}

class CPlayersTypes {
  type: PlayersTypes

  constructor(type: PlayersTypes = PlayersTypes.SimpleAI) {
    this.type = type
  }
}

export class Pan extends React.Component {

  public board: Board
  public deck: Card[]
  // /* @Input()  */players: number
  /* @Input()  */ai: boolean
  /* @Input()  */playersList: CPlayersTypes[]
  // /* @Input()  */playerDelay: number
  public playersTypes = [
    PlayersTypes.Human,
    PlayersTypes.SimpleAI,
    PlayersTypes.Random,
    PlayersTypes.MCTS,
    PlayersTypes.AZ
  ]

  state = {
    players: 2,
    playerDelay: 50,
  }

  constructor(props) {
    super(props)
    this.init()
  }

  init() {
    // this.playerDelay = 50
    // this.players = 2
    this.setPlayersTypes()
    this.ai = true
    this.newGame(this.state.players, this.ai)
  }

  numberToFigure = (figure: Figure): String => {
    return Card.numberToFigure(figure)
  }

  newGameClick = () => {
    this.newGame(this.state.players, this.ai)
  }

  startGameClick = () => {
    this.board.start()
  }

  round = (number: number): number => {
    return Math.round(number)
  }

  newGame = (players: number, ai: boolean) => {
    if (this.board) {
      this.board.stop()
    }
    this.deck = Deck.generate()
    this.deck = Deck.shuffle(this.deck)
    this.board = new Board()
    for (let i = 0; i < players; i++) {
      switch (this.playersList[i].type) {
        case PlayersTypes.SimpleAI:
          this.board.addPlayer(new PlayerAI())
          break
        case PlayersTypes.Random:
          this.board.addPlayer(new PlayerRandom())
          break
        case PlayersTypes.MCTS:
          this.board.addPlayer(new MCTS())
          break
        case PlayersTypes.AZ:
          this.board.addPlayer(new PlayerAZ())
          break
        default:
          this.board.addPlayer(new Player())
          break
      }
    }
    this.board.dealingCards(this.deck.map(card => card))
    this.board.setPlayerDelay(this.state.playerDelay)
  }

  updatePlayerDelay = (e) => {
    this.setState({ playerDelay: e.target.value })
    this.board.setPlayerDelay(e.target.value)
  }

  setPlayersTypes = () => {
    this.playersList = []
    this.playersList.push(new CPlayersTypes(PlayersTypes.Human))
    this.playersList.push(new CPlayersTypes(PlayersTypes.MCTS))
    for (let i = 2; i < 24; i++) {
      this.playersList.push(new CPlayersTypes())
    }
  }

  render() {

    return <>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 p-1">
          <div className="card m-2">
            <div className="card-header">
              <h4>
                Settings
                <button className="d-inline btn btn-light onecard" onClick={this.newGameClick} >New Game</button>
                <button className="d-inline btn btn-light onecard" onClick={this.startGameClick} >Start Game</button>
              </h4>
            </div>
            <div className="card-body" >
              <div>
                <label> Player delay: {this.state.playerDelay}</label>
                <input type="range" className="form-control-range" id="playerDelay" value={this.state.playerDelay} min="0" max="300" onChange={this.updatePlayerDelay} />
              </div>
              <div>
                <div className="form-group">
                  <label>Players: {this.state.players}</label>
                  <input type="range" className="form-control-range" id="formControlRange" value={this.state.players} min="1" max="24" onChange={(e) => this.setState({ players: parseInt(e.target.value) })} />
                </div>
              </div>



              <div className="players">
                <ol>
                  {this.playersList.map((playerElement, i) => <li key={i} hidden={i >= this.state.players}>
                    <div className="form-group">
                      {this.playersTypes.map((type, n) => {
                        return <div key={type}>
                          <input className="form-check-input" type="radio" name={"inlineRadioOptions" + i} id={"inlineRadio" + n + "-" + i} value={type} checked={playerElement.type === type} />
                          <label className="form-check-label" htmlFor={"inlineRadio" + n + "-" + i}>{type}</label>
                        </div>
                      })}
                    </div>
                  </li>)}
                </ol>
              </div>



              <div className="deck">
                Deck:
               {this.deck.map(card => <span key={"" + card.toString()} className={"btn btn-light disabled onecard " + card.getColorStyle()} >
                  {card.toString()}
                </span>)}
              </div >
            </div>

          </div></div></div> {/* delete dist line */}
      {/* </div >

    </div >
      <div className="col p-1">

        <div className="card m-2">
          <div className="card-header">
            <h4>
              Board
                </h4>
            Token: Player {{ board.getToken() + 1 }};
                Moves: {{ board.getMovesCount() }}<br />
            <span [hidden]="!(2 > board.playersStillPlay())">
                {{ board.getMovesCount() }};<span *ngFor="let player of board.getPlayers()"
                >{{ playersList[player.id].type }};{{ board.procentComplate(player.id) }};</span>
                </span>
      </div>
      <div className="card-body" >
        <div className="players">
          <ol>
            <li *ngFor="let player of board.getPlayers()">
                        <button 
                            *ngFor="let card of player.cards"
(click)=board.action(card)
className="btn btn-light onecard"
[ngClass]=card.getColorStyle()
[disabled]="!board.isActionAvalible(card, player.id)" >
                            {{ card.toString() }} 
                        </button>
          <button
                            *ngFor="let figure of player.getFigureActions(board.getStack().length)"
className="btn btn-light onecard"
(click)=board.setComboMode(figure)
[disabled]="!board.isComboActionAvalible(figure, player.id)" >
                            {{ numberToFigure(figure) }} 
                        </button>
        {{ round(board.procentComplate(player.id) * 10000)/100}}%
                    </li>
                </ol >
                </div >

      <div className="stack">
        Stack:
                <span 
                    *ngFor="let card of board.getStack()"
className="btn btn-light disabled onecard"
[ngClass]=card.getColorStyle()>
                    {{ card.toString() }}
                </span>
      <button 
                    (click) = board.getFromStack()
    className = "btn btn-light onecard"
    [hidden] = "!(board.getStack().length > 1)" >
      Get cards
                </button >
                </div >
            </div >
        </div >
    </div >
</div > */}
    </>

  }

}
