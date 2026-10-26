<script lang="ts">
  import type { Card } from '../engine/Card'
  import CardElement from './CardElement.svelte'

  export let cards: Card[]
  export let move: (card: Card) => void = () => {}
  export let possible: (card: Card) => boolean = () => false
  export let hidden = false
  export let compact = false
</script>

<div class="hand" class:compact class:hidden style={`--count: ${cards.length}`}>
  {#each cards as card (card.text)}
    <span class="slot"
      ><CardElement {card} click={move} {hidden} {possible} {compact} /></span
    >
  {/each}
</div>

<style>
  .hand {
    display: flex;
    justify-content: center;
    padding: 15px 10px 5px;
    min-height: 128px;
    width: max-content;
    min-width: 100%;
  }
  .slot {
    flex: 0 1 48px;
    min-width: 15px;
    max-width: 48px;
    position: relative;
  }
  .slot:last-child {
    flex: 0 0 76px;
  }
  .slot:hover,
  .slot:focus-within {
    z-index: 2;
  }
  .compact {
    padding: 12px 3px 0;
    min-height: 77px;
    width: auto;
  }
  .compact .slot {
    flex-basis: 22px;
    max-width: 22px;
    min-width: 6px;
  }
  .compact .slot:last-child {
    flex: 0 0 45px;
  }
  .hidden .slot {
    flex-basis: 15px;
    max-width: 15px;
  }
  @media (max-width: 600px) {
    .hand {
      min-height: 110px;
      padding-inline: 4px;
    }
    .slot {
      flex-basis: 34px;
      max-width: 34px;
      min-width: 8px;
    }
    .slot:last-child {
      flex-basis: 62px;
    }
    .compact {
      min-height: 67px;
    }
    .compact .slot {
      flex-basis: 13px;
      max-width: 13px;
      min-width: 3px;
    }
    .compact .slot:last-child {
      flex-basis: 37px;
    }
    .hidden .slot {
      flex-basis: 10px;
      max-width: 10px;
    }
  }
</style>
