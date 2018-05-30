import { Card } from "./card"
import { Player } from "./player"
import { Figure } from "./figure";
import { Color } from "./color";

export class Board {
    private stack : Card[]
    private players : Player[]
    private token : Number

    public constructor() {
        this.stack = []
        this.players = []
        this.token = -1
    }

    public addPlayer(player : Player) {
        this.players.push(player)
    }

    public dealingCards(deck: Card[]) {
        var startCard = new Card(Figure.f9, Color.Kier)
        while(deck.length && this.players.length) {
            for(let i = 0; i < this.players.length; i++) {
                if(!deck.length) break
                var card = deck.pop()
                if(card.isEqual(startCard)) this.token = i
                this.players[i].cards.push(card)
            }
        }
        for (const player of this.players) {
            player.sortCards()
        }
    }

    public getPlayers() : Player[] {
        return this.players
    }

    public getToken() : Number {
        return this.token
    }
    
}
