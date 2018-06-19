import { Card } from "./card"

export class Deck {
    public static generate() : Card[] {
        const deck : Card[] = []
        for (let i = 9; i <= 14; i++) {
          for (let j = 1; j <= 4; j++) {
            deck.push(new Card(i,j))
          }
        }
        return deck
    }

    public static shuffle(deck : Card[]) : Card[] {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]]
        }
        return deck
    }
}
