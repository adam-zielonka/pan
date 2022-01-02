import { Board, IPlayer } from '../engine/board'
import { Card, Deck, Figure } from '../engine/card'
import PlayersStore from './PlayersStore'
import { SubscribableStore } from './storeUtils'

class GameStore extends SubscribableStore {
  stack: Card[] = []
  players: IPlayer[] = []
  token = 0
  board: Board = new Board()

  constructor(private playersStore: PlayersStore) {
    super()
    this.newGame()
  }

  get smallStack(): Card[] {
    return this.stack.slice(0, 3)
  }

  isActionAvailable = (actionCard: Card, playerID: number): boolean => {
    return this.board.isActionAvailable(actionCard, playerID)
  }

  isComboActionAvailable = (figure: Figure, playerID: number): boolean => {
    return this.board.isComboActionAvailable(figure, playerID)
  }

  setComboMode = (figure: Figure): void => {
    this.board.setComboMode(figure)
  }

  getFromStack = (): void => {
    this.board.getFromStack()
  }

  action = (actionCard: Card): void => {
    this.board.action(actionCard)
  }

  render = (board: Board): void => {
    this.token = board.getCurrentPlayer().id
    this.stack = board.getStack()
    this.players = board.getPlayers()
    this.notify()
  }

  newGame = (): void => {
    if (this.board) {
      this.board.stop()
    }
    this.board = new Board()
    this.board.setPlayerDelay(100)
    this.board.setRender(this.render)
    this.board.setPlayers(this.playersStore.getGamePlayers())
    this.board.dealingCards(Deck.print(Deck.shuffle(Deck.generate())))
    this.render(this.board)
    this.board.start()
  }
}

export default GameStore
