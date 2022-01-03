<script lang="ts">
  import { IPlayer } from '../engine/board'
  import { store } from '../store/store'
  import CardElement from './CardElement.svelte'
  import { Card } from '../engine/card'
  import Cards from './Cards.svelte'

  export let player: IPlayer

  const { game } = store
</script>

<div>
  #{player.id + 1} ({player.cards.length})
  <Cards>
    {#each player.cards as card}
      <CardElement {card} disabled={!game.isActionAvailable(card, player.id)} />
    {/each}
    {#each player.getFigureActions($game.stack.length !== 0) as figure}
      <button on:click={() => game.setComboMode(figure)}>
        {Card.numberToFigure(figure)}
      </button>
    {/each}
  </Cards>
</div>
