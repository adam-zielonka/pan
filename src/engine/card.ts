export enum Figure {
  f9 = 9,
  f10,
  J,
  Q,
  K,
  A,
}

export enum Color {
  Kier = 1,
  Karo,
  Trefl,
  Pik,
}

export class Deck {
  public static generate(): Card[] {
    const deck: Card[] = []
    for (let i = 9; i <= 14; i++) {
      for (let j = 1; j <= 4; j++) {
        deck.push(new Card(i, j))
      }
    }
    return deck
  }

  public static shuffle(deck: Card[]): Card[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
  }

  public static print(deck: Card[]): Card[] {
    const log = []
    const styles = []
    for (const card of deck) {
      log.push(`%c${card.text}`)
      styles.push(`color: ${card && card.colorStyle}`)
    }
    console.log(log.join(' '), ...styles)
    return deck
  }
}

export class Card {
  static figureToString(figure: Figure): string {
    switch (figure) {
      case Figure.f9:
        return '9'
      case Figure.f10:
        return '10'
      case Figure.J:
        return 'J'
      case Figure.Q:
        return 'Q'
      case Figure.K:
        return 'K'
      case Figure.A:
        return 'A'
    }
  }

  constructor(public readonly figure: Figure, public readonly color: Color) {}

  get colorStyle(): string {
    switch (this.color) {
      case Color.Karo:
      case Color.Kier:
        return 'red'
      case Color.Trefl:
      case Color.Pik:
        return 'black'
    }
  }

  get text(): string {
    return this.color ? `${this.figureText}${this.colorText}` : this.figureText
  }

  get colorText(): string {
    switch (this.color) {
      case Color.Karo:
        return '♦'
      case Color.Kier:
        return '♥'
      case Color.Trefl:
        return '♣'
      case Color.Pik:
        return '♠'
    }
  }

  get figureText(): string {
    return Card.figureToString(this.figure)
  }

  get isPik(): boolean {
    return this.color === Color.Pik
  }

  get isStartCard(): boolean {
    return this.isEqual(new Card(Figure.f9, Color.Kier))
  }

  isEqual(card: Card): boolean {
    return this.figure === card.figure && this.color === card.color
  }

  compare(card: Card): number {
    if (this.figure < card.figure) {
      return -1
    } else if (this.figure > card.figure) {
      return 1
    }
    return 0
  }

  compareColors(card: Card): number {
    if (this.figure < card.figure) {
      return -1
    } else if (this.figure > card.figure) {
      return 1
    } else if (this.color > card.color) {
      return 1
    } else if (this.color < card.color) {
      return -1
    }
    return 0
  }
}
