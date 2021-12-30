<script lang="ts">
  import { store } from '../store/store'
  const { game } = store

  $: smallStack = game.stack.slice(Math.max(game.stack.length - 3, 0))
</script>

<div>
  {#if $game.stack.length > 3}
    <button disabled={true}> ... </button>
  {/if}
  <div>
    {#each smallStack as card}
      {card.toString()}
    {/each}
  </div>
  {#each $game.stack as card}
    {card.toString()}
  {/each}
  <button
    on:click={game.getFromStack}
    disabled={$game.stack.length > 1 && $game.token === 0 ? false : true}
  >
    Get
  </button>
</div>
