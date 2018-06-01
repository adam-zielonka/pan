import { Card, Figure } from "./card"
import { Board, IPlayer } from "./board";

export class Player implements IPlayer {
    private cards: Card[] = []
    private id : number

    constructor(private ai : boolean) {

    }
    
    public getID(): number {
        return this.id
    }
    public setID(id: number) {
        this.id = id
    }
    public getCards(): Card[] {
        return this.cards
    }

    public sortCards() {
        this.cards.sort((a,b) => a.compare(b))
    }

    public action(actionCard: Card) : Card {
        for (let i = 0; i < this.cards.length; i++) {
            if(actionCard.isEqual(this.cards[i])){
                return this.cards.splice(i, 1)[0]
            }
        }
        return undefined
    }

    public getFigureActions(isStackEmpty) : Figure[] {
        this.sortCards()
        var figureActions : Figure[] = []
        var figure : Figure = Figure.f9
        var count = isStackEmpty ? 1 : 0
        for (const card of this.cards) {
            if(card.getValue() == figure) {
                count++
                if(count == 4) figureActions.push(figure)
            } else {
                figure = card.getValue()
                count = 1
            }
        }
        return figureActions
    }

    public play(board: Board) {
        if(this.ai) setTimeout(() => {
            var sucess = false
            if(board.isActionAvalible(this.cards[0], this.id)) {
                board.action(this.cards[0])
                sucess = true
            } else if(board.isActionAvalible(this.cards[this.cards.length - 1], this.id)){
                if(this.cards[this.cards.length - 1].getValue() < this.cards[0].getValue() + 4) {
                    board.action(this.cards[this.cards.length - 1])
                    sucess = true
                }
            }
            if(!sucess) board.getFromStack()
        }, 100)
    }
}
