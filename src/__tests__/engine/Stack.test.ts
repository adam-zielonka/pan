import { Color, Figure } from '../../new-engine/Card'
import { Card } from '../../new-engine/Card'
import { Stack } from '../../new-engine/Stack'

describe('Stack', () => {
  it('getFromStack() if stack has no card', () => {
    const stack = new Stack()
    expect(stack.numberOfCardsThatCanBeGetFromStack).toBe(0)
    const cards = stack.getFromStack()
    expect(cards.length).toBe(0)
  })
  it('getFromStack() if stack has 1 card', () => {
    const stack = new Stack()
    stack.push(new Card(Figure.f9, Color.Kier))
    expect(stack.numberOfCardsThatCanBeGetFromStack).toBe(0)
    const cards = stack.getFromStack()
    expect(cards.length).toBe(0)
  })
  it('getFromStack() if stack has 2 card', () => {
    const stack = new Stack()
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.f9, Color.Kier))
    expect(stack.numberOfCardsThatCanBeGetFromStack).toBe(1)
    const cards = stack.getFromStack()
    expect(cards.length).toBe(1)
  })
  it('getFromStack() if stack has 3 card', () => {
    const stack = new Stack()
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.f9, Color.Kier))
    expect(stack.numberOfCardsThatCanBeGetFromStack).toBe(2)
    const cards = stack.getFromStack()
    expect(cards.length).toBe(2)
  })
  it('getFromStack() if stack has 5 card', () => {
    const stack = new Stack()
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.f9, Color.Kier))
    expect(stack.numberOfCardsThatCanBeGetFromStack).toBe(3)
    const cards = stack.getFromStack()
    expect(cards.length).toBe(3)
  })

  it('putCardOnStack() if stack has no card and you have starter card', () => {
    const stack = new Stack()
    const card = new Card(Figure.f9, Color.Kier)
    stack.putCardOnStack(card)
    expect(stack.length).toBe(1)
    expect(stack[0]).toBe(card)
  })
  it('putCardOnStack() if stack has no card and you do not have starter card', () => {
    const stack = new Stack()
    const card = new Card(Figure.f9, Color.Karo)
    stack.putCardOnStack(card)
    expect(stack.length).toBe(0)
  })
  it('putCardOnStack() if stack has cards and you have valid card', () => {
    const stack = new Stack()
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.J, Color.Kier))
    const card = new Card(Figure.A, Color.Karo)
    stack.putCardOnStack(card)
    expect(stack.length).toBe(3)
    expect(stack[2]).toBe(card)
  })
  it('putCardOnStack() if stack has cards and you have not valid card', () => {
    const stack = new Stack()
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.J, Color.Kier))
    const card = new Card(Figure.f10, Color.Karo)
    stack.putCardOnStack(card)
    expect(stack.length).toBe(2)
  })
  it('isPossibleToGetCardFromStack() if stack has no card', () => {
    const stack = new Stack()
    expect(stack.isPossibleToGetCardFromStack()).toBe(false)
  })
  it('isPossibleToGetCardFromStack() if stack has 1 card', () => {
    const stack = new Stack()
    stack.push(new Card(Figure.f9, Color.Kier))
    expect(stack.isPossibleToGetCardFromStack()).toBe(false)
  })
  it('isPossibleToGetCardFromStack() if stack has 2 card', () => {
    const stack = new Stack()
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.f9, Color.Kier))
    expect(stack.isPossibleToGetCardFromStack()).toBe(true)
  })
  it('isPossibleToGetCardFromStack() if stack has 3 card', () => {
    const stack = new Stack()
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.f9, Color.Kier))
    stack.push(new Card(Figure.f9, Color.Kier))
    expect(stack.isPossibleToGetCardFromStack()).toBe(true)
  })
})
