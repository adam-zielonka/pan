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

  it('putCardOnStack() if stack has no card and you have starter card', () => {
    const board = new Board()
    const card = new Card(Figure.f9, Color.Kier)
    board.putCardOnStack(card)
    expect(board.stack.length).toBe(1)
    expect(board.stack[0]).toBe(card)
  })
  it('putCardOnStack() if stack has no card and you do not have starter card', () => {
    const board = new Board()
    const card = new Card(Figure.f9, Color.Karo)
    board.putCardOnStack(card)
    expect(board.stack.length).toBe(0)
  })
  it('putCardOnStack() if stack has cards and you have valid card', () => {
    const board = new Board()
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.J, Color.Kier))
    const card = new Card(Figure.A, Color.Karo)
    board.putCardOnStack(card)
    expect(board.stack.length).toBe(3)
    expect(board.stack[2]).toBe(card)
  })
  it('putCardOnStack() if stack has cards and you have not valid card', () => {
    const board = new Board()
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.J, Color.Kier))
    const card = new Card(Figure.f10, Color.Karo)
    board.putCardOnStack(card)
    expect(board.stack.length).toBe(2)
  })
  it('isPossibleToGetCardFromStack() if stack has no card', () => {
    const board = new Board()
    expect(board.isPossibleToGetCardFromStack()).toBe(false)
  })
  it('isPossibleToGetCardFromStack() if stack has 1 card', () => {
    const board = new Board()
    board.stack.push(new Card(Figure.f9, Color.Kier))
    expect(board.isPossibleToGetCardFromStack()).toBe(false)
  })
  it('isPossibleToGetCardFromStack() if stack has 2 card', () => {
    const board = new Board()
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.f9, Color.Kier))
    expect(board.isPossibleToGetCardFromStack()).toBe(true)
  })
  it('isPossibleToGetCardFromStack() if stack has 3 card', () => {
    const board = new Board()
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.f9, Color.Kier))
    board.stack.push(new Card(Figure.f9, Color.Kier))
    expect(board.isPossibleToGetCardFromStack()).toBe(true)
  })
})
