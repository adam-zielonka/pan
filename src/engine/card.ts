export enum Figure {
  f9 = 9, f10, J, Q, K, A
}

export enum Color {
  Kier = 1, Karo, Trefl, Pik
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
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
  }
  
  public static print(deck: Card[]): Card[] {
    const log = []
    const styles = []
    for (const card of deck) {
      log.push(`%c${card.toString()}`)
      styles.push(`color: ${card && card.getColorStyle()}`)
    }
    console.log(log.join(' '), ...styles)
    return deck
  }
}

export class Card {
  public static numberToColor(color: Color): string {
    switch (color) {
    case Color.Karo: return '♦'
    case Color.Kier: return '♥'
    case Color.Trefl: return '♣'
    case Color.Pik: return '♠'
    }
  }

  public static numberToFigure(figure: Figure): string {
    switch (figure) {
    case Figure.f9: return '9'
    case Figure.f10: return '10'
    case Figure.J: return 'J'
    case Figure.Q: return 'Q'
    case Figure.K: return 'K'
    case Figure.A: return 'A'
    }
  }

  public constructor(
      private value: Figure,
      private color: Color
  ) {}

  public getValue(): number {
    return this.value
  }

  public getColor(): number {
    return this.color
  }

  public getColorStyle(): string {
    switch (this.color) {
    case Color.Karo:
    case Color.Kier: return 'red'
    case Color.Trefl:
    case Color.Pik: return 'black'
    }
  }

  private numberToColor(): string {
    return Card.numberToColor(this.color)
  }

  private numberToFigure(): string {
    return Card.numberToFigure(this.value)
  }

  public toString(): string {
    return this.color ? `${this.numberToFigure()}${this.numberToColor()}` : this.numberToFigure()
  }

  public isEqual(card: Card): boolean {
    return this.value === card.getValue() && this.color === card.getColor()
  }

  public isPik(): boolean {
    return this.color === Color.Pik
  }

  public compare(card: Card): number {
    if (this.value < card.getValue()) { return -1 }
    if (this.value > card.getValue()) { return 1 }
    return 0
  }

  public compareColors(card: Card): number {
    if (this.value < card.getValue()) { return -1 }
    if (this.value > card.getValue()) { return 1 }
    if (this.color > card.getColor()) { return 1 }
    if (this.color < card.getColor()) { return -1 }
    return 0
  }

  public isStartCard(): boolean {
    return this.isEqual(new Card(Figure.f9, Color.Kier))
  }
}
