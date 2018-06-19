import { Card } from "./card"

export class Stack extends Array<Card> {
    public getLastCard() : Card | undefined {
        return this.length ? this[this.length - 1] : undefined
    }
}