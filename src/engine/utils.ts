export const printPlayer = (id: number, name: string): void => {
  console.log(`%c#${id + 1} ${name}`, 'font-weight:bold;font-size:1.5rem;')
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
