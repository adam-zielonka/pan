<script>
  import { store } from '../store/store'
  import PlayerElement from './PlayerElement.svelte'
  import Stack from './Stack.svelte'

  const { game } = store
</script>

<div>
  {#each $game.players as player}
    <PlayerElement {player} />
  {/each}
  <Stack />
</div>
