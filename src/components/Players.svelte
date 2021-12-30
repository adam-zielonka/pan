<script lang="ts">
  import { store } from '../store/store'
  import Player from './Player.svelte'
  const { players } = store
</script>

{#each $players.players as player, i}
  <Player id={i} {player} set={players.set} />
{/each}
