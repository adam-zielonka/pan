<script lang="ts">
  import type { Card } from '../engine/Card'
  import CardElement from './CardElement.svelte'

  export let cards: Card[]
  export let move: (card: Card) => void = () => {}
  export let possible: (card: Card) => boolean = () => false
  export let hidden = false
  export let compact = false
</script>

<div class="hand" class:compact class:hidden>
  {#each cards as card (card.text)}
    <span class="slot"
      ><CardElement {card} click={move} {hidden} {possible} {compact} /></span
    >
  {/each}
</div>

<style>
  .hand {
    --slot-width: 48px;
    --card-width: 76px;
    display: flex;
    justify-content: center;
    padding: 14px 6px 6px;
    min-height: 128px;
    width: max-content;
    min-width: 100%;
  }
  .slot {
    flex: 0 0 var(--slot-width);
    width: var(--slot-width);
    max-width: var(--slot-width);
    min-width: 0;
    position: relative;
  }
  .slot:last-child {
    flex: 0 0 var(--card-width);
    width: var(--card-width);
    max-width: var(--card-width);
  }
  .slot:hover,
  .slot:focus-within {
    z-index: 2;
  }
  .compact {
    --slot-width: 24px;
    --card-width: 45px;
    padding: 6px 3px 3px;
    min-height: 74px;
  }
  .compact.hidden {
    --slot-width: 15px;
    width: 100%;
    min-width: 0;
  }
  .compact.hidden .slot:not(:last-child) {
    flex-shrink: 1;
  }
  @media (max-width: 600px) {
    .hand {
      --slot-width: 44px;
      --card-width: 62px;
      min-height: 110px;
      padding-inline: 4px;
    }
    .compact {
      --slot-width: 20px;
      --card-width: 37px;
      min-height: 63px;
      padding-inline: 3px;
    }
    .compact.hidden {
      --slot-width: 10px;
    }
  }
</style>
