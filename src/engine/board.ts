import { Card, Figure, Color } from './card'
import { Player } from './players/player'

export interface IPlayer {
    getID(): number
    getCards(): Card[]
    setCards(cards: Card[])
    sortCards()
    action(actionCard: Card): Card
    getFigureActions(isStackEmpty): Figure[]
    play(board: Board)
}

export class Board {
    private stack: Card[]
    private players: IPlayer[]
    private stillPlay: number
    private comboMode: Figure
    private comboCounter: number
    private time = 0
    private token: number
    private simulation: boolean
    private movesCount: number
    private render: (board: Board) => void
    private timeout: NodeJS.Timeout

    public constructor(board: Board = null) {
      if (board) {
        this.simulation = true
        this.stack = board.stack.map(card => card)
        this.players = []
        for (const player of board.players) {
          const newPlayer = new Player(player.getID())
          newPlayer.setCards(player.getCards().map(card => card))
          this.players.push(newPlayer)
        }
        this.token = board.token
        this.stillPlay = board.stillPlay
        this.comboMode = board.comboMode
        this.comboCounter = board.comboCounter
        this.movesCount = board.movesCount
      } else {
        this.simulation = false
        this.stack = []
        this.players = []
        this.token = -1
        this.stillPlay = 0
        this.movesCount = 0
      }
    }

    public setPlayerDelay(playerDelay: number) {
      this.time = playerDelay
    }

    public start() {
      if (this.stillPlay > 1 && !this.simulation) {
        this.timeout = setTimeout(() => this.getCurrentPlayer().play(this), this.time)
      }
    }

    public stop() {
      this.simulation = true
      clearTimeout(this.timeout)
    }

    public addPlayer(player: IPlayer) {
      this.stillPlay++
      this.players.push(player)
    }

    public addPlayers(players: IPlayer[]) {
      for (const player of players) {
        this.addPlayer(player)
      }
    }

    public dealingCards(deck: Card[]) {
      while (deck.length && this.players.length) {
        for (const player of this.players) {
          if (!deck.length) { break }
          const card = deck.pop()
          if (card.isStartCard()) { this.token = player.getID() }
          player.getCards().push(card)
        }
      }
      this.players.forEach(player => player.sortCards())
    }

    public getPlayers(): IPlayer[] {
      return this.players
    }

    public getCurrentPlayer(): IPlayer {
      if (this.token > -1) { return this.players[this.token] }
      return null
    }

    public getToken(): number {
      return this.token
    }

    public getStack(): Card[] {
      return this.stack
    }

    public getComboMode(): Figure {
      return this.comboMode
    }

    public getLastCard(): Card {
      return this.stack.length ? this.stack[this.stack.length - 1] : undefined
    }

    public isActionAvailable(actionCard: Card, playerID = this.getToken()): boolean {
      if (this.comboMode) {
        return this.stack.length
          ? this.comboMode === actionCard.getValue()
          : actionCard.isStartCard()
      }
      if (this.getLastCard()) {
        return (this.getToken() === playerID) && (this.getLastCard().compare(actionCard) !== 1)
      }
      return actionCard.isStartCard()
    }

    public isComboActionAvailable(figure: Figure, playerID = this.getToken()): boolean {
      if (this.comboMode) { return false }
      if (this.getToken() !== playerID) { return false }
      if (this.stack.length) { return this.getLastCard().compare(new Card(figure, null)) !== 1 }
      return figure === 9
    }

    public action(actionCard: Card) {
      if (this.stillPlay < 2) { return }
      const card = this.players[this.token].action(actionCard)
      if (card) {
        this.stack.push(card)
        if (!this.getCurrentPlayer().getCards().length) { this.stillPlay-- }
        if (!this.comboMode) { this.nextPlayer() } else {
          if (!--this.comboCounter) {
            this.comboMode = undefined
            this.nextPlayer()
          }
        }
      }
      if(this.render) this.render(this)
    }

    public playersStillPlay(): number {
      return this.stillPlay
    }

    public setComboMode(figure: Figure, auto = false) {
      if (this.stillPlay < 2) { return }
      this.comboMode = figure
      this.comboCounter = figure === Figure.f9 && this.stack.length ? 3 : 4
      if (auto || this.players.length <= 2 || this.playersStillPlay() <= 2) {
        for (let color: Color = 5 - this.comboCounter; color <= 4; ++color) {
          this.action(new Card(figure, color))
        }
      }
      if(this.render) this.render(this)
    }

    public getFromStack() {
      if (this.stillPlay < 2) { return }
      let counter = 3
      while (this.stack.length > 1 && counter--) {
        this.getCurrentPlayer().getCards().push(this.stack.pop())
      }
      this.getCurrentPlayer().sortCards()
      this.nextPlayer()
    }

    public setRender(render: (board: Board) => void) {
      this.render = render
    }

    public nextPlayer() {
      if (!this.simulation) {
        if(this.render) this.render(this)
      }
      if (this.stack.length && this.stack[this.stack.length - 1].isPik()) {
        this.token--
        if (this.token < 0) {
          this.token = this.players.length - 1
        }
      } else {
        this.token++
        if (this.token >= this.players.length) {
          this.token = 0
        }
      }
      if (!this.getCurrentPlayer().getCards().length) {
        this.nextPlayer()
      } else {
        if (this.stillPlay > 1 && !this.simulation) {
          this.movesCount++
          if(this.render) this.render(this)
          this.timeout = setTimeout(() => this.getCurrentPlayer().play(this), this.time)
        }
      }
    }

    public getPossibleActions(): Card[] {
      const cards: Card[] = []
      for (const card of this.getCurrentPlayer().getCards()) {
        if (this.isActionAvailable(card)) {
          cards.push(card)
        }
      }
      return cards
    }

    public getPossibleComboActions(): Figure[] {
      return this.getCurrentPlayer().getFigureActions(this.getStack().length).reduce((actions, figure) => {
        if (this.isComboActionAvailable(figure)) { actions.push(figure) }
        return actions
      }, [])
    }

    public playersPoints(player: IPlayer): number {
      const cards = player.getCards()
      let points = 0
      cards.forEach(card => points += 15 - card.getValue())
      return points
    }

    public procentComplete(playerID: number = null): number {
      let opponentsPoints = 0
      let points = 0
      const token = playerID !== null ? playerID : this.getToken()
      this.players.forEach(player => {
        if (player.getID() !== token) {
          opponentsPoints += this.playersPoints(player)
        } else {
          points += this.playersPoints(player)
        }
      })
      let points3 = 0
      this.stack.forEach(card => points3 += 15 - card.getValue())
      return 1 - (points / (points + opponentsPoints + points3 ))
    }

    public getMovesCount() {
      return this.movesCount
    }

}
