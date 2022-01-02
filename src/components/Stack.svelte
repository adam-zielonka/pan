<script lang="ts">
  import { store } from '../store/store'
  import Card from './CardElement.svelte'
  const { game } = store
</script>

<div>
  ({$game.stack.length})
  {#if $game.stack.length > 3}
    <button disabled={true}> ... </button>
  {/if}
  {#each $game.smallStack as card}
    <Card {card} disabled />
  {/each}
  <button
    on:click={game.getFromStack}
    disabled={$game.stack.length > 1 && $game.token === 0 ? false : true}
  >
    Get
  </button>
</div>
