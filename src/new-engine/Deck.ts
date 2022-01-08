import { Card, Color, Figure } from './Card'

export class Deck {
  static generate(): Card[] {
    const deck: Card[] = []
    for (let figure = Figure.f9; figure <= Figure.A; figure++) {
      for (let color = Color.Kier; color <= Color.Pik; color++) {
        deck.push(new Card(figure, color))
      }
    }
    return deck
  }

  static shuffle(deck: Card[]): Card[] {
    const newDeck = [...deck]
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }
    return newDeck
  }
}
