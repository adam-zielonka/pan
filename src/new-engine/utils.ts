import autoBind from 'auto-bind'

export abstract class SubscribableStore {
  subscribers: Array<(value: typeof this) => void> = []

  constructor() {
    autoBind(this)
  }

  subscribe(subscriber: (value: typeof this) => void): () => void {
    this.subscribers.push(subscriber)
    subscriber(this)
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== subscriber)
    }
  }

  notify(): void {
    this.subscribers.forEach(s => s(this))
  }
}
