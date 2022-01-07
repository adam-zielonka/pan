<script lang="ts">
  import { crossfade } from 'svelte/transition'
  import StackElement from './StackElement.svelte'
  import PlayerElement from './PlayerElement.svelte'
  import { store } from '../store/store'

  const { game } = store

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),
  })
</script>

<main>
  <div class="stack">
    <StackElement stack={$game.stack} move={game.getFromStack} {receive} {send} />
  </div>
  {#each $game.players as player}
    <div class={`player${player.id + 1}`}>
      <PlayerElement
        cards={player.cards}
        move={game.action}
        possible={card => game.isActionAvailable(card, player.id)}
        {receive}
        {send}
        hidden={player.id !== 0}
      />
    </div>
  {/each}
</main>

<style>
  div {
    padding: 10px;
  }

  main {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 10px;
  }

  .stack {
    grid-column: 2;
    grid-row: 2;
  }

  .player1 {
    grid-column: 2;
    grid-row: 3;
  }

  .player2 {
    grid-column: 1;
    grid-row: 2;
  }

  .player3 {
    grid-column: 2;
    grid-row: 1;
  }

  .player4 {
    grid-column: 3;
    grid-row: 2;
  }
</style>
