<script lang="ts">
  import { flip } from 'svelte/animate'
  import { quintOut } from 'svelte/easing'
  import { crossfade } from 'svelte/transition'
  import { onMount } from 'svelte'

  import { Card, Deck } from '../engine/card'

  import CardElement from './CardElement.svelte'

  let deck: Card[] = []
  let stack: Card[] = []

  onMount(() => {
    deck = Deck.generate()
  })

  function moveToStack(card: Card): void {
    stack = [...stack, card]
    deck = deck.filter(c => c !== card)
  }

  function moveToDeck(card: Card): void {
    deck = [...deck, card]
    stack = stack.filter(c => c !== card)
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

<div>
  <header>
    {#each stack as card (card)}
      <span animate:flip in:receive={{ key: card }} out:send={{ key: card }}>
        <CardElement {card} on:click={() => moveToDeck(card)} />
      </span>
    {/each}
  </header>
  <main>
    {#each deck as card (card)}
      <span animate:flip in:receive={{ key: card }} out:send={{ key: card }}>
        <CardElement {card} on:click={() => moveToStack(card)} />
      </span>
    {/each}
  </main>
</div>

<style>
  div {
    bottom: 20px;
    position: absolute;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  main,
  header {
    display: flex;
    flex-direction: row;
  }
</style>
