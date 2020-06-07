import { observable, action } from 'mobx'
import { Board, IPlayer } from '../engine/board'
import { Card, Deck, Figure } from '../engine/card'
import PlayersStore from './PlayersStore'

class GameStore {
  @observable stack: Card[]
  @observable players: IPlayer[]
  @observable token: number
  board: Board

  constructor(private playersStore: PlayersStore) {
    this.newGame()
  }

  isActionAvailable = (actionCard: Card, playerID: number): boolean => {
    return this.board.isActionAvailable(actionCard, playerID)
  }

  isComboActionAvailable = (figure: Figure, playerID: number): boolean => {
    return this.board.isComboActionAvailable(figure, playerID)
  }

  setComboMode = (figure: Figure) => {
    this.board.setComboMode(figure)
  }

  getFromStack = () => {
    this.board.getFromStack()
  }

  action = (actionCard: Card) => {
    this.board.action(actionCard)
  }

  @action render = (board: Board) => {
    this.token = board.getToken()
    this.stack = board.getStack()
    this.players = board.getPlayers()
  }

  @action newGame = () => {
    this.board = new Board()
    this.board.setRender(this.render)
    this.board.addPlayers(this.playersStore.getGamePlayers())
    this.board.dealingCards(Deck.print(Deck.shuffle(Deck.generate())))
    this.board.setPlayerDelay(100)
    this.render(this.board)
    this.board.start()
  }
}

export default GameStore
