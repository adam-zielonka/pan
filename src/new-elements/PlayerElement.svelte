<script lang="ts">
  import { Card } from '../new-engine/Card'

  import { flip } from 'svelte/animate'
  import { CrossfadeParams, TransitionConfig } from 'svelte/transition'

  import CardElement from './CardElement.svelte'

  export let cards: Card[]

  export let move: (card: Card) => void

  export let possible: (card: Card) => boolean

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
    <span
      animate:flip
      in:receive={{ key: card }}
      out:send={{ key: card }}
      class={hidden ? 'hidden' : ''}
    >
      <CardElement {card} click={() => move(card)} {hidden} {possible} />
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

  .hidden {
    width: 5px;
  }
</style>
