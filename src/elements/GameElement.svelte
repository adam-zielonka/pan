<script>
  import BoardElement from './BoardElement.svelte'
  import { store } from '../store/store'
  import PlayerSelectElement from './PlayerSelectElement.svelte'

  const { game, players } = store
</script>

<div>
  <button on:click={game.newGame}>New Game</button>
  {#each $players.players as player, i}
    <PlayerSelectElement id={i} {player} set={players.set} />
  {/each}
</div>

<BoardElement />

<style>
  :global(body) {
    background-color: rgb(126, 204, 126);
    font-family: 'Courier New', Courier, monospace;
  }

  div {
    display: flex;
    justify-content: center;
  }
</style>
