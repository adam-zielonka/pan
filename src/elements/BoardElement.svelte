<script lang="ts">
  import { quintOut } from 'svelte/easing'
  import { crossfade } from 'svelte/transition'
  import { onMount } from 'svelte'

  import { Card, Deck } from '../engine/card'
  import StackElement from './StackElement.svelte'
  import PlayerElement from './PlayerElement.svelte'

  let deck: Card[] = []
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
    while (deck.length) {
      let card = deck.pop()
      if (!card) {
        return
      }
      deck = [...deck]
      player1.push(card)
      player1 = [...player1]
      await sleep(50)

      card = deck.pop()
      if (!card) {
        return
      }
      deck = [...deck]
      player2.push(card)
      player2 = [...player2]
      await sleep(50)

      card = deck.pop()
      if (!card) {
        return
      }
      deck = [...deck]
      player3.push(card)
      player3 = [...player3]
      await sleep(50)

      card = deck.pop()
      if (!card) {
        return
      }
      deck = [...deck]
      player4.push(card)
      player4 = [...player4]
      await sleep(50)
    }
  }

  onMount(() => {
    deck = Deck.shuffle(Deck.generate())
    setTimeout(() => void dealingCards())
  })

  function moveToStack(card: Card): void {
    stack = [...stack, card]
    deck = deck.filter(c => c !== card)
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

    fallback(node) {
      const style = getComputedStyle(node)
      const transform = style.transform === 'none' ? '' : style.transform

      return {
        duration: 600,
        easing: quintOut,
        css: t => `
    			transform: ${transform} scale(${t});
    			opacity: ${t}
    		`,
      }
    },
  })
</script>

<main>
  <div class="stack">
    <StackElement {stack} move={moveToDeck} {receive} {send} />
  </div>
  <div class="deck">
    <PlayerElement cards={deck} move={moveToStack} {receive} {send} />
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
  .deck {
    position: absolute;
    top: -1000px;
    left: -1000px;
  }
  div {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
