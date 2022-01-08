import { Color, Figure } from '../../new-engine/Card'
import { Card } from '../../new-engine/Card'
import { Board } from '../../new-engine/Board'

describe('Board', () => {
  it('getFromStack() if stack has no card', () => {
    const board = new Board()
    expect(board.numberOfCardsThatCanBeGetFromStack).toBe(0)
    const cards = board.getFromStack()
    expect(cards.length).toBe(0)
  })
  it('getFromStack() if stack has 1 card', () => {
    const board = new Board()
    board.stack.push(new Card(Figure.f9, Color.Kier))
    expect(board.numberOfCardsThatCanBeGetFromStack).toBe(0)
    const cards = board.getFromStack()
    expect(cards.length).toBe(0)
  })
  it('getFromStack() if stack has 2 card', () => {
    const board = new Board()
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.f9, Color.Kier))
    expect(board.numberOfCardsThatCanBeGetFromStack).toBe(1)
    const cards = board.getFromStack()
    expect(cards.length).toBe(1)
  })
  it('getFromStack() if stack has 3 card', () => {
    const board = new Board()
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.f9, Color.Kier))
    expect(board.numberOfCardsThatCanBeGetFromStack).toBe(2)
    const cards = board.getFromStack()
    expect(cards.length).toBe(2)
  })
  it('getFromStack() if stack has 5 card', () => {
    const board = new Board()
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.f9, Color.Kier))
    expect(board.numberOfCardsThatCanBeGetFromStack).toBe(3)
    const cards = board.getFromStack()
    expect(cards.length).toBe(3)
  })
})
