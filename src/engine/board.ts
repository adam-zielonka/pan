import { Card, Figure, Color, Deck } from './card'

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface IPlayer {
  id: number
  cards: Card[]
  addCard(card: Card): void
  action(actionCard: Card): Card
  getFigureActions(isStackEmpty: boolean): Figure[]
  play(board: Board): void
  copy(): IPlayer
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
  private render: (board: Board) => void
  private timeout: NodeJS.Timeout

  public constructor(board: Board = null) {
    if (board) {
      this.simulation = true
      this.stack = board.stack.map(card => card)
      this.players = board.players.map(player => player.copy())
      this.token = board.token
      this.stillPlay = board.stillPlay
      this.comboMode = board.comboMode
      this.comboCounter = board.comboCounter
    } else {
      this.simulation = false
      this.stack = []
      this.players = []
      this.token = -1
      this.stillPlay = 0
    }
  }

  public setPlayerDelay(playerDelay: number) {
    this.time = playerDelay
  }

  public setRender(render: (board: Board) => void) {
    this.render = render
  }

  public setPlayers(players: IPlayer[]) {
    this.players = players
    this.stillPlay = players.length
  }

  public getPlayers(): IPlayer[] {
    return this.players
  }

  public getCurrentPlayer(): IPlayer {
    if (this.token > -1) {
      return this.players[this.token]
    }
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

  public isGameOver(): boolean {
    return this.stillPlay < 2
  }

  public isActionAvailable = (actionCard: Card, playerID = this.getToken()): boolean => {
    if (this.comboMode) {
      return this.stack.length
        ? this.comboMode === actionCard.figure
        : actionCard.isStartCard
    }
    if (this.getLastCard()) {
      return this.getToken() === playerID && this.getLastCard().compare(actionCard) !== 1
    }
    return actionCard.isStartCard
  }

  public isComboActionAvailable = (
    figure: Figure,
    playerID = this.getToken(),
  ): boolean => {
    if (this.comboMode) {
      return false
    }
    if (this.getToken() !== playerID) {
      return false
    }
    if (this.stack.length) {
      return this.getLastCard().compare(new Card(figure, null)) !== 1
    }
    return figure === 9
  }

  public start() {
    this.playPlayer()
  }

  public stop() {
    this.simulation = true
    clearTimeout(this.timeout)
  }

  public dealingCards(deck: Card[]) {
    while (deck.length && this.players.length) {
      this.players.forEach((player, index) => {
        if (!deck.length) return
        const card = deck.pop()
        if (card.isStartCard) {
          this.token = index
        }
        player.addCard(card)
      })
    }
  }

  public action(actionCard: Card) {
    if (this.isGameOver()) return
    const card = this.players[this.token].action(actionCard)
    if (card) {
      this.stack.push(card)
      if (!this.getCurrentPlayer().cards.length) {
        this.stillPlay--
      }
      if (!this.comboMode) {
        this.nextPlayer()
      } else {
        if (!--this.comboCounter) {
          this.comboMode = undefined
          this.nextPlayer()
        }
      }
    }
    if (this.render) this.render(this)
  }

  public playersStillPlay(): number {
    return this.stillPlay
  }

  public setComboMode(figure: Figure, auto = false) {
    if (this.isGameOver()) return
    this.comboMode = figure
    this.comboCounter = figure === Figure.f9 && this.stack.length ? 3 : 4
    if (auto || this.players.length <= 2 || this.playersStillPlay() <= 2) {
      for (let color: Color = 5 - this.comboCounter; color <= 4; ++color) {
        this.action(new Card(figure, color))
      }
    }
    if (this.render) this.render(this)
  }

  public getFromStack() {
    if (this.isGameOver()) return
    let counter = 3
    while (this.stack.length > 1 && counter--) {
      this.getCurrentPlayer().addCard(this.stack.pop())
    }
    this.nextPlayer()
  }

  public async nextPlayer(): Promise<void> {
    if (this.stack.length && this.stack[this.stack.length - 1].isPik) {
      this.token = --this.token < 0 ? this.players.length - 1 : this.token
    } else {
      this.token = ++this.token >= this.players.length ? 0 : this.token
    }

    if (!this.getCurrentPlayer().cards.length) {
      await this.nextPlayer()
      return
    }

    setTimeout(() => this.playPlayer(), 400)
  }

  public playPlayer = (): void => {
    if (this.render) this.render(this)
    if (this.isGameOver() || this.simulation) return
    this.timeout = setTimeout(() => this.getCurrentPlayer().play(this), this.time)
  }

  public getPossibleActions(): Card[] {
    return this.getCurrentPlayer().cards.filter(card => this.isActionAvailable(card))
  }

  public getPossibleComboActions(): Figure[] {
    const isStackEmpty = !!this.getStack().length
    return this.getCurrentPlayer()
      .getFigureActions(isStackEmpty)
      .filter(this.isComboActionAvailable)
  }

  public procentComplete(player: IPlayer = null): number {
    const formula = (points: number, card: Card): number => {
      return points + 15 - card.figure
    }

    const maxPoint = Deck.generate().reduce(formula, 0)
    const points = (player || this.getCurrentPlayer()).cards.reduce(formula, 0)
    return 1 - points / maxPoint
  }
}
