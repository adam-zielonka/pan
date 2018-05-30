import { Card } from "./card"
import { Player } from "./player"

export class Board {
    private stack : Card[]
    private players : Player[]
    private token : Number

    public constructor() {
        this.stack = []
        this.players = []
    }

    public addPlayer(player : Player) {
        this.players.push(player)
    }

    public dealingCards(deck: Card[]) {
        while(deck.length && this.players.length) {
            for(const player of this.players) {
                if(!deck.length) break
                player.cards.push(deck.pop())
            }
        }
    }

    public getPlayers() : Player[] {
        return this.players
    }
    
}
