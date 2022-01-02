<script lang="ts">
  import { IPlayer } from '../engine/board'
  import { store } from '../store/store'
  import Card from './CardElement.svelte'

  export let player: IPlayer

  const { game } = store
</script>

<div>
  {#each player.cards as card}
    <Card {card} />
  {/each}
</div>
