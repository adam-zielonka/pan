<script lang="ts">
  import { crossfade } from 'svelte/transition'
  import StackElement from './StackElement.svelte'
  import PlayerElement from './PlayerElement.svelte'
  import { store } from '../new-engine/Store'
  import CardElement from './CardElement.svelte'

  const { game } = store

  const [receive, send] = crossfade({
    duration: d => Math.sqrt(d * 500),
  })
</script>

<div>
  {#each $game.deck as card}
    <span in:receive={{ key: card }} out:send={{ key: card }} class="deck">
      <CardElement {card} click={() => console.log('click')} possible={() => false} />
    </span>
  {/each}
</div>

<main>
  <div class="stack">
    <StackElement
      stack={$game.stack}
      move={() => game.players[game.token].makeAction(game, 'stack')}
      {receive}
      {send}
    />
  </div>
  {#each $game.players as player}
    <div class={`player${player.idText}`}>
      <header class={player.id === $game.token ? 'token' : ''}>
        #{player.idText}
      </header>
      <PlayerElement
        cards={player.cards}
        move={card => player.makeAction(game, card)}
        possible={card => game.isPossibleToMoveCard(player, card)}
        {receive}
        {send}
        hidden={player.id !== 0}
      />
    </div>
  {/each}
  <div class="combo">
    {#if $game.isComboModeRady && !$game.isComboMode && $game.token === 0}
      <button on:click={() => game.players[0].makeAction(game, 'skip')}>
        >Skip Combo</button
      >
    {/if}
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

  .deck {
    position: absolute;
    top: -1000px;
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

  .player1 header {
    margin-bottom: 20px;
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
