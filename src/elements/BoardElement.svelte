<script lang="ts">
  import { crossfade } from 'svelte/transition'
  import { onMount } from 'svelte'

  import { Card, Deck } from '../engine/card'
  import StackElement from './StackElement.svelte'
  import PlayerElement from './PlayerElement.svelte'

  let stack: Card[] = []
  let player1: Card[] = []
  let player2: Card[] = []
  let player3: Card[] = []
  let player4: Card[] = []
  let counter = 0

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async function dealingCards(): Promise<void> {
    while (stack.length) {
      let card = stack.pop()
      if (!card) {
        return
      }
      stack = [...stack]
      player1.push(card)
      player1 = [...player1]
      await sleep(150)

      card = stack.pop()
      if (!card) {
        return
      }
      stack = [...stack]
      player2.push(card)
      player2 = [...player2]
      await sleep(150)

      card = stack.pop()
      if (!card) {
        return
      }
      stack = [...stack]
      player3.push(card)
      player3 = [...player3]
      await sleep(150)

      card = stack.pop()
      if (!card) {
        return
      }
      stack = [...stack]
      player4.push(card)
      player4 = [...player4]
      await sleep(150)
    }
  }

  onMount(() => {
    stack = Deck.shuffle(Deck.generate())
    setTimeout(() => void dealingCards(), 500)
  })

  function moveToStack(card: Card): void {
    stack = [...stack, card]
    player1 = player1.filter(c => c !== card)
    player2 = player2.filter(c => c !== card)
    player3 = player3.filter(c => c !== card)
    player4 = player4.filter(c => c !== card)
  }

  function moveToDeck(card: Card): void {
    if (counter % 4 === 0) {
      player1 = [...player1, card]
    }
    if (counter % 4 === 1) {
      player2 = [...player2, card]
    }
    if (counter % 4 === 2) {
      player3 = [...player3, card]
    }
    if (counter % 4 === 3) {
      player4 = [...player4, card]
    }
    stack = stack.filter(c => c !== card)
    counter++
  }

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),
  })
</script>

<main>
  <div class="stack">
    <StackElement {stack} move={moveToDeck} {receive} {send} />
  </div>
  <div class="player1">
    <PlayerElement cards={player1} move={moveToStack} {receive} {send} />
  </div>
  <div class="player2">
    <PlayerElement cards={player2} move={moveToStack} {receive} {send} />
  </div>
  <div class="player3">
    <PlayerElement cards={player3} move={moveToStack} {receive} {send} />
  </div>
  <div class="player4">
    <PlayerElement cards={player4} move={moveToStack} {receive} {send} />
  </div>
</main>

<style>
  div {
    padding: 10px;
  }

  main {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }

  .stack {
    grid-column: 2;
    grid-row: 2;
  }

  .player1 {
    grid-column: 2;
    grid-row: 3;
  }

  .player2 {
    grid-column: 1;
    grid-row: 2;
  }

  .player3 {
    grid-column: 2;
    grid-row: 1;
  }

  .player4 {
    grid-column: 3;
    grid-row: 2;
  }
</style>
