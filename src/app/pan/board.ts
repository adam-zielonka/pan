import { Card, Figure, Color } from './card'
import { Player } from './players/player'

export interface IPlayer {
    getID(): number
    setID(id: number)
    getCards(): Card[]
    sortCards()
    action(actionCard: Card): Card
    getFigureActions(isStackEmpty): Figure[]
    play(board: Board)
}

export class Board {
    private stack: Card[]
    private players: IPlayer[]
    private token: number
    private startCard: Card
    private sitllPlay: number
    private comboMode: Figure
    private comboCounter: number

    public constructor(board: Board = null) {
        if (board) {
          this.stack = board.stack.map(a => a)// new Card(a.getValue(), a.getColor()))
          this.players = []
          for (const player of board.players) {
            const newPlayer = new Player()
            newPlayer.setID(player.getID())
            newPlayer.setCards(player.getCards().map(a => a))// new Card(a.getValue(), a.getColor())))
            this.players.push(newPlayer)
          }
          this.token = board.token
          this.sitllPlay = board.sitllPlay
          this.startCard = board.startCard
          this.comboMode = board.comboMode
          this.comboCounter = board.comboCounter
        } else {
          this.stack = []
          this.players = []
          this.token = -1
          this.sitllPlay = 0
          this.startCard = new Card(Figure.f9, Color.Kier)
        }
    }

    public addPlayer(player: IPlayer) {
        this.sitllPlay++
        player.setID(this.players.length)
        this.players.push(player)
    }

    public dealingCards(deck: Card[]) {
        while (deck.length && this.players.length) {
            for (let i = 0; i < this.players.length; i++) {
                if (!deck.length) { break }
                const card = deck.pop()
                if (card.isEqual(this.startCard)) { this.token = i }
                this.players[i].getCards().push(card)
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

    public getLastCard(): Card {
      return this.stack.length ? this.stack[this.stack.length - 1] : undefined
  }

    public isActionAvalible(actionCard: Card, playerID = this.getToken()): boolean {
        if (this.comboMode) {
          return this.stack.length
            ? this.comboMode === actionCard.getValue()
            : this.startCard.isEqual(actionCard)
        }
        if (this.getLastCard()) {
            return (this.getToken() === playerID) && (this.getLastCard().compare(actionCard) !== 1)
        }
        return this.startCard.isEqual(actionCard)
    }

    public isComboActionAvalible(figure: Figure, playerID = this.getToken()): boolean {
        if (this.comboMode) { return false }
        if (this.getToken() !== playerID) { return false }
        if (this.stack.length) { return this.getLastCard().compare(new Card(figure, null)) !== 1 }
        return figure === 9
    }

    public action(actionCard: Card) {
        if (this.sitllPlay < 2) { return }
        const card = this.players[this.token].action(actionCard)
        if (card) {
            this.stack.push(card)
            if (!this.getCurrentPlayer().getCards().length) { this.sitllPlay-- }
            if (!this.comboMode) { this.nextPlayer() } else {
                if (!--this.comboCounter) {
                    this.comboMode = undefined
                    this.nextPlayer()
                }
            }
        }
    }

    public playersStillPlay(): Number {
      let count = 0
      for (const player of this.players) {
        if (player.getCards().length) { count++ }
      }
      return count
    }

    public setComboMode(figure: Figure, auto = false) {
        if (this.sitllPlay < 2) { return }
        this.comboMode = figure
        this.comboCounter = figure === Figure.f9 && this.stack.length ? 3 : 4
        if (auto || this.players.length <= 2 || this.playersStillPlay() <= 2) {
          for (let color: Color = 5 - this.comboCounter; color <= 4; ++color) {
            this.action(new Card(figure, color))
          }
        }
    }

    public getFromStack() {
        if (this.sitllPlay < 2) { return }
        let counter = 3
        while (this.stack.length > 1 && counter--) {
            this.getCurrentPlayer().getCards().push(this.stack.pop())
        }
        this.getCurrentPlayer().sortCards()
        this.nextPlayer()
    }

    public nextPlayer() {
      if (this.stack[this.stack.length - 1].isPik()) { this.token--
      } else { this.token++ }
      if (this.token < 0) { this.token = this.players.length - 1 }
      if (this.token >= this.players.length) { this.token = 0 }
      if (!this.getCurrentPlayer().getCards().length) { this.nextPlayer()
      } else {
        if (this.sitllPlay > 1) {
          setTimeout(() => this.getCurrentPlayer().play(this), 200)
        }
      }
    }

    public getPosibleActions(): Card[] {
      const cards: Card[] = []
      for (const card of this.getCurrentPlayer().getCards()) {
        if (this.isActionAvalible(card)) {
          cards.push(card)
        }
      }
      return cards
    }

    public getPosibleComboActions(): Figure[] {
      return this.getCurrentPlayer().getFigureActions(this.getStack().length)
    }

}
