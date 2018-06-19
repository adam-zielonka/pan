import { Card, Color, Figure } from "./card"
import { Stack } from "./stack"

export interface IPlayer {
    getID() : number
    setID(id : number) : void
    getCards() : Card[]
    sortCards() : void
    action(actionCard: Card) : Card | undefined
    getFigureActions(isStackEmpty: boolean) : Figure[]
    play(board: Board) : void
}

export class Board {
    private stack : Stack
    private players : IPlayer[]
    private token : number
    private startCard : Card
    private sitllPlay : number
    private comboMode : Figure | null
    private comboCounter : number

    public constructor() {
        this.stack = new Stack()
        this.players = []
        this.token = -1
        this.sitllPlay = 0
        this.startCard = new Card(Figure.f9, Color.Kier)
    }

    public addPlayer(player : IPlayer) {
        this.sitllPlay++
        player.setID(this.players.length)
        this.players.push(player)
    }

    public dealingCards(deck: Card[]) {
        while(deck.length && this.players.length) {
            for(let i = 0; i < this.players.length; i++) {
                if(!deck.length) { break }
                const card = deck.pop()
                if(card) {
                    if(card.isEqual(this.startCard)) { this.token = i }
                    this.players[i].getCards().push(card)
                }
            }
        }
        this.players.forEach(player => player.sortCards())
    }

    public getPlayers() : IPlayer[] {
        return this.players
    }

    public getCurrentPlayer() : IPlayer | undefined {
        if(this.token > -1) {
            return this.players[this.token]
        }
        return undefined
    }

    public getToken() : number {
        return this.token
    }

    public getStack() : Card[] {
        return this.stack
    }

    public isActionAvalible(actionCard : Card, playerID : number) : boolean {
        if(this.comboMode) { return this.stack.length ? this.comboMode === actionCard.getValue() : this.startCard.isEqual(actionCard) }
        const lastCard = this.stack.getLastCard()
        if(lastCard) {
            return (this.getToken() === playerID) && (lastCard.compare(actionCard) !== 1)
        }
        return this.startCard.isEqual(actionCard)
    }

    public isComboActionAvalible(figure : Figure, playerID : number) : boolean {
        if(this.comboMode) { return false }
        if(this.getToken() !== playerID) { return false }
        const lastCard = this.stack.getLastCard()
        if(lastCard) { return lastCard.compare(new Card(figure)) !== 1 }
        return figure === 9
        
    }

    public action(actionCard : Card) {
        const card = this.players[this.token].action(actionCard)
        if(card) {
            this.stack.push(card)
            const player = this.getCurrentPlayer()
            if(player && !player.getCards().length) { this.sitllPlay-- }
            if(!this.comboMode) { this.nextPlayer() }
            else {
                if(!--this.comboCounter) {
                    this.comboMode = null
                    this.nextPlayer()
                }
            }
        }
    }

    public setComboMode(figure : Figure) {
        this.comboMode = figure
        this.comboCounter = figure === Figure.f9 && this.stack.length ? 3 : 4
    }

    public getFromStack() {
        let counter = 3
        const player = this.getCurrentPlayer()
        if(player) {
            while(this.stack.length > 1 && counter--) {
                const card = this.stack.pop()
                if(card) { player.getCards().push(card) }
            }
            player.sortCards()
        }
        this.nextPlayer()
    }

    public nextPlayer() {
        const player = this.getCurrentPlayer()
        if(player && this.sitllPlay > 0) {
            if(this.stack[this.stack.length - 1].isPik()) { this.token-- }
            else { this.token++ }
            if(this.token < 0) { this.token = this.players.length - 1 }
            if(this.token >= this.players.length) { this.token = 0 }
            if(!player.getCards().length) { this.nextPlayer() }
            else { setTimeout(() => player && player.play(this), 200) }
        }
    }
    
}
