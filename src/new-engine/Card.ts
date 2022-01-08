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

  static colorToString(color: Color): string {
    switch (color) {
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

  constructor(readonly figure: Figure, readonly color: Color) {}

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
    return `${this.figureText}${this.colorText}`
  }

  get colorText(): string {
    return Card.colorToString(this.color)
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

  compareFigures(figure: Figure): number {
    switch (true) {
      case this.figure > figure:
        return 1
      case this.figure < figure:
        return -1
      default:
        return 0
    }
  }

  compare(card: Card): number {
    switch (true) {
      case this.figure > card.figure:
        return 1
      case this.figure < card.figure:
        return -1
      case this.color > card.color:
        return 1
      case this.color < card.color:
        return -1
      default:
        return 0
    }
  }
}
