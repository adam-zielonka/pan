<script lang="ts">
  import { store } from '../engine/Store'
  import { flip } from 'svelte/animate'
  import { CrossfadeParams, TransitionConfig } from 'svelte/transition'
  import { Card } from '../engine/Card'
  import CardElement from './CardElement.svelte'

  const { game } = store

  export let stack: Card[]

  export let move: (card: Card) => void

  export let send: (
    node: Element,
    params: CrossfadeParams & {
      key: Card
    },
  ) => () => TransitionConfig

  export let receive: (
    node: Element,
    params: CrossfadeParams & {
      key: Card
    },
  ) => () => TransitionConfig
</script>

<div>
  {#each stack as card, i (card)}
    <span
      animate:flip
      in:receive={{ key: card }}
      out:send={{ key: card }}
      class={i > stack.length - 4 ? 'lastThree' : 'hidden'}
    >
      <CardElement
        {card}
        click={() => $game.token === 0 && move(card)}
        possible={() => i > 0 && i > stack.length - 4}
      />
    </span>
  {/each}
  <footer>&nbsp;</footer>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  footer {
    width: 62px;
  }

  .hidden {
    /* width: 0px; */
    width: 25px;
  }

  .lastThree {
    width: 25px;
  }
</style>
