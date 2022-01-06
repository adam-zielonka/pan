<script lang="ts">
  import { flip } from 'svelte/animate'
  import { CrossfadeParams, TransitionConfig } from 'svelte/transition'
  import { Card } from '../engine/card'

  import CardElement from './CardElement.svelte'

  export let cards: Card[]

  export let move: (card: Card) => void

  export let hidden = false

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
  {#each cards as card (card)}
    <span animate:flip in:receive={{ key: card }} out:send={{ key: card }}>
      <CardElement {card} on:click={() => move(card)} {hidden} />
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

  span {
    width: 25px;
  }
</style>
