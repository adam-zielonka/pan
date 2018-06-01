import { Card, Figure, Color } from "./card"
import { Player } from "./player"

export class Stack extends Array<Card> {
    public getLastCard() : Card {
        return this.length ? this[this.length - 1] : undefined
    }
}

export class Board {
    private stack : Stack
    private players : Player[]
    private token : number
    private startCard : Card
    private sitllPlay : number
    private comboMode : Figure
    private comboCounter : number

    public constructor() {
        this.stack = new Stack()
        this.players = []
        this.token = -1
        this.sitllPlay = 0
        this.startCard = new Card(Figure.f9, Color.Kier)
    }

    public addPlayer(player : Player) {
        this.sitllPlay++
        player.id = this.players.length
        this.players.push(player)
    }

    public dealingCards(deck: Card[]) {
        while(deck.length && this.players.length) {
            for(let i = 0; i < this.players.length; i++) {
                if(!deck.length) break
                var card = deck.pop()
                if(card.isEqual(this.startCard)) this.token = i
                this.players[i].cards.push(card)
            }
        }
        this.players.forEach(player => player.sortCards())
    }

    public getPlayers() : Player[] {
        return this.players
    }

    public getCurrentPlayer() : Player {
        if(this.token > -1) return this.players[this.token]
    }

    public getToken() : Number {
        return this.token
    }

    public getStack() : Card[] {
        return this.stack
    }

    public isActionAvalible(actionCard : Card, playerID) : boolean {
        if(this.comboMode) return this.stack.length ? this.comboMode == actionCard.getValue() : this.startCard.isEqual(actionCard)
        if(this.stack.getLastCard())
            return (this.getToken() == playerID) && (this.stack.getLastCard().compare(actionCard) != 1)
        return this.startCard.isEqual(actionCard)
    }

    public isComboActionAvalible(figure : Figure, playerID) : boolean {
        if(this.comboMode) return false
        if(this.getToken() != playerID) return false
        if(this.stack.length) return this.stack.getLastCard().compare(new Card(figure, null)) != 1
        return figure == 9
        
    }

    public action(actionCard) {
        var card = this.players[this.token].action(actionCard)
        if(card) {
            this.stack.push(card)
            if(!this.getCurrentPlayer().cards.length) this.sitllPlay--
            if(!this.comboMode) this.nextPlayer()
            else {
                if(!--this.comboCounter) {
                    this.comboMode = undefined
                    this.nextPlayer()
                }
            }
        }
    }

    public setComboMode(figure : Figure) {
        this.comboMode = figure
        this.comboCounter = figure == Figure.f9 && this.stack.length ? 3 : 4
    }

    public getFromStack() {
        var counter = 3
        while(this.stack.length > 1 && counter--) 
            this.getCurrentPlayer().cards.push(this.stack.pop())
        this.getCurrentPlayer().sortCards()
        this.nextPlayer()
    }

    public nextPlayer() {
        if(this.sitllPlay > 0) {
            if(this.stack[this.stack.length - 1].isPik()) this.token--
            else this.token++
            if(this.token < 0) this.token = this.players.length - 1
            if(this.token >= this.players.length) this.token = 0
            if(!this.getCurrentPlayer().cards.length) this.nextPlayer()
            else this.getCurrentPlayer().play(this)
        }
    }
    
}
