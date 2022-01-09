import { Color, Figure } from '../../engine/Card'
import { Deck } from '../../engine/Deck'

describe('Deck', () => {
  it('generate()', () => {
    const deck = Deck.generate()
    expect(deck.length).toBe(24)
    expect(deck[0].figure).toBe(Figure.f9)
    expect(deck[0].color).toBe(Color.Kier)
    expect(deck[23].figure).toBe(Figure.A)
    expect(deck[23].color).toBe(Color.Pik)
  })

  it('shuffle()', () => {
    const deck = Deck.generate()
    const deck2 = Deck.shuffle(deck)
    expect(deck).not.toBe(deck2)
    expect(deck.length).toEqual(deck2.length)
  })
})
