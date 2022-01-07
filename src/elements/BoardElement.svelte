<script lang="ts">
  import { crossfade } from 'svelte/transition'
  import StackElement from './StackElement.svelte'
  import PlayerElement from './PlayerElement.svelte'
  import { store } from '../store/store'
  import { Card } from '../engine/card'

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
      <header
        class={`${player.id === 0 ? 'playerIDOne ' : ''}` +
          `${player.id === $game.token ? 'token' : ''}`}
      >
        #{player.id + 1}
      </header>
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
  <div class="combo">
    {#each $game.players[0].getFigureActions($game.stack.length !== 0) as figure}
      <button
        on:click={() => game.setComboMode(figure)}
        disabled={!game.isComboActionAvailable(figure, $game.players[0].id)}
      >
        {Card.figureToString(figure)}
      </button>
    {/each}
  </div>
</main>

<style>
  div {
    padding: 10px;
  }

  header {
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
  }

  .playerIDOne {
    margin-bottom: 20px;
  }

  .token {
    text-decoration: double overline;
  }

  main {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr auto;
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

  .combo {
    grid-column: 2;
    grid-row: 4;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
