import { Card } from "./card"

export class Player {
    public cards: Card[] = []

    public sortCards() {
        this.cards.sort((a,b) => a.compare(b))
    }
}
