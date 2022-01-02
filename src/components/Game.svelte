<script>
  import { store } from '../store/store'

  import Board from './Board.svelte'
  import Players from './Players.svelte'

  const { game } = store
</script>

<div>
  <div>
    <button on:click={game.newGame}>New Game</button>
    <Players />
  </div>
  <Board />
</div>
