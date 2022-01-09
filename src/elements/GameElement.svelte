<script lang="ts">
  import BoardElement from './BoardElement.svelte'
  import { store } from '../engine/Store'
  import PlayerSelectElement from './PlayerSelectElement.svelte'

  const { game } = store

  let disabled = false

  function newGame(): void {
    disabled = true
    game.newGame()
    setTimeout(() => {
      disabled = false
    }, 1000)
  }
</script>

<div>
  <button on:click={newGame} {disabled}>New Game</button>
  {#each $game.playersSelect as player, i}
    <PlayerSelectElement id={i} {player} set={$game.playersSelect.set} />
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
