<script lang="ts">
  import { store } from '../store/store'
  import Card from './CardElement.svelte'
  const { game } = store
</script>

<div>
  {#if $game.stack.length > 3}
    <button disabled={true}> ... </button>
  {/if}
  {#each $game.smallStack as card}
    <Card {card} />
  {/each}
  {#if $game.stack.length > 3}
    ...
  {/if}
  <button
    on:click={game.getFromStack}
    disabled={$game.stack.length > 1 && $game.token === 0 ? false : true}
  >
    Get
  </button>
</div>
