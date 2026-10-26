<script lang="ts">
  import StackElement from './StackElement.svelte'
  import PlayerElement from './PlayerElement.svelte'
  import { store } from '../engine/Store'
  import { PlayerType } from '../engine/PlayerType'
  import { strategies } from '../engine/strategies'

  const { game } = store
  export let round = 1
  let allCardsVisible = false
  $: humanTurn =
    !$game.isGameOver && $game.players[$game.token]?.type === PlayerType.Human
  $: current = strategies[$game.players[$game.token]?.type || PlayerType.Human]
  $: me = $game.players[0]
  $: loser = $game.players.find(player => player.isPlaying)
  $: canTake = humanTurn && $game.isPossibleToGetCardFromStack()
  $: combo = $game.isComboModeRady || $game.isComboMode
  $: status = $game.deck.length
    ? 'Rozdajemy karty…'
    : $game.isGameOver
      ? `Koniec rozdania · ${loser?.id === 0 && me.type === PlayerType.Human ? 'zostajesz' : `${strategies[loser?.type || PlayerType.None].name} zostaje`} z kartami`
      : humanTurn
        ? combo
          ? 'Możesz zagrać serię'
          : 'Twój ruch'
        : `${current.name} wybiera ruch…`
</script>

<section class="game-board" aria-label="Stół do gry">
  <div class="table-toolbar">
    <div class="round">
      <span class="live-dot"></span> ROZDANIE {String(round).padStart(2, '0')}
    </div>
    <label class="reveal"
      ><input type="checkbox" bind:checked={allCardsVisible} /><span
        >Pokaż karty rywali</span
      ></label
    >
  </div>
  <div class="felt">
    <div class="table-outline"></div>
    <div class="felt-mark" aria-hidden="true">
      P<span>A</span>N<small>KLASYCZNA GRA KARCIANA</small>
    </div>
    {#each $game.players.slice(1) as player}
      {@const strategy = strategies[player.type]}
      {#if player.type !== PlayerType.None}
        <div
          class={`opponent opponent-${player.id}`}
          class:active={!$game.isGameOver && player.id === $game.token}
        >
          <div class="player-badge">
            <span class={`avatar ${strategy.color}`}>{strategy.initials}</span>
            <div>
              <strong>{strategy.name}</strong><span class="player-method"
                >{strategy.method}</span
              >
            </div>
            <span class="card-count">{player.cards.length || '✓'}</span>
          </div>
          {#if player.cards.length}
            <PlayerElement cards={player.cards} hidden={!allCardsVisible} compact />
          {:else if !$game.deck.length}
            <div class="finished">Poza grą ✓</div>
          {/if}
          {#if !$game.isGameOver && player.id === $game.token}<div class="thinking">
              <i></i><i></i><i></i>
            </div>{/if}
        </div>
      {/if}
    {/each}
    <div class="center-stack"><StackElement /></div>
    <div class="direction">
      <span>{$game.stack.isPikOnTop ? '↶' : '↷'}</span>{$game.stack.isPikOnTop
        ? 'Pik · ruch w lewo'
        : 'Ruch w prawo'}
    </div>
  </div>
  <div class="your-area">
    <div class="turn-line" role="status" aria-live="polite">
      <span class:your-turn={humanTurn} class="status-dot"></span>
      <strong>{status}</strong>
      {#if !$game.isGameOver && humanTurn}<span class="turn-hint"
          >{combo ? 'Zagraj tę samą figurę' : 'Wybierz podświetloną kartę'}</span
        >{/if}
      <span class="move-count">Ruch {$game.moveCount}</span>
    </div>
    <div class="hand-header">
      <span
        >{me.type === PlayerType.Human
          ? 'TWOJA RĘKA'
          : `${strategies[me.type].name.toUpperCase()} · OBSERWUJESZ GRĘ`}</span
      ><span>{me.cards.length} kart</span>
    </div>
    <div class="your-hand">
      {#if me.cards.length}
        <PlayerElement
          cards={me.cards}
          move={card => me.makeAction(game, card)}
          possible={card => humanTurn && game.isPossibleToMoveCard(me, card)}
        />
      {:else}
        <div class="empty-hand">
          {$game.deck.length
            ? 'Za chwilę dostaniesz karty.'
            : 'Wszystkie karty zagrane. Dobra robota! ♡'}
        </div>
      {/if}
    </div>
    <div class="hand-actions">
      <span class="help-hint"
        ><span>i</span>
        {$game.isGameOver
          ? 'Rozdaj ponownie, by zagrać jeszcze raz.'
          : 'Pozbądź się kart. Ostatni przy stole przegrywa.'}</span
      >
      <div class="action-buttons">
        {#if humanTurn && $game.isComboModeRady && !$game.isComboMode}<button
            class="button subtle small"
            on:click={() => me.makeAction(game, 'skip')}>Pomiń serię</button
          >{/if}
        <button
          class="button take-button small"
          disabled={!canTake}
          on:click={() => me.makeAction(game, 'stack')}
          >Dobierz {$game.stack.numberOfCardsThatCanBeGetFromStack || ''} ze stosu
          <span>↓</span></button
        >
      </div>
    </div>
  </div>
</section>

<style>
  .game-board {
    border: 1px solid #3e5b4a;
    border-radius: 16px;
    overflow: hidden;
    background: #182722;
    box-shadow: 0 20px 60px #0002;
  }
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 17px 22px;
    border-bottom: 1px solid #b9d4ba0d;
  }
  .round {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #bdc9ba;
  }
  .live-dot {
    height: 5px;
    width: 5px;
    border-radius: 50%;
    background: #aac598;
    box-shadow: 0 0 8px #aac59855;
  }
  .reveal {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #a8b5ad;
    font-size: 10px;
    cursor: pointer;
  }
  .reveal input {
    accent-color: #b9d8b8;
    width: 12px;
    height: 12px;
  }
  .felt {
    height: 360px;
    position: relative;
    background: radial-gradient(
      ellipse at 50% 20%,
      #285a43 0%,
      #204b38 48%,
      #1b3f31 100%
    );
    isolation: isolate;
  }
  .felt::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.15;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%23fff' filter='url(%23n)' opacity='.3' d='M0 0h160v160H0z'/%3E%3C/svg%3E");
  }
  .table-outline {
    position: absolute;
    inset: 29px 38px 30px;
    border: 1px solid #91b79020;
    border-radius: 140px;
    z-index: -1;
  }
  .felt-mark {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #c4d3aa0b;
    font:
      90px Georgia,
      serif;
    letter-spacing: 12px;
    text-align: center;
    white-space: nowrap;
    z-index: -1;
  }
  .felt-mark > span {
    font-size: 72px;
  }
  .felt-mark small {
    display: block;
    margin-top: 8px;
    font:
      7px system-ui,
      sans-serif;
    letter-spacing: 5px;
  }
  .opponent {
    position: absolute;
    width: 190px;
    text-align: center;
  }
  .opponent-1 {
    top: 125px;
    left: 24px;
  }
  .opponent-2 {
    top: 21px;
    left: calc(50% - 95px);
  }
  .opponent-3 {
    top: 125px;
    right: 24px;
  }
  .player-badge {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 8px 10px;
    border: 1px solid #9bb7a71f;
    border-radius: 10px;
    background: #102b22b3;
    text-align: left;
    box-shadow: 0 3px 10px #0001;
  }
  .player-badge :global(.avatar) {
    width: 31px;
    height: 31px;
    font-size: 10px;
    border-radius: 9px;
  }
  strong {
    font-size: 12px;
    font-weight: 550;
  }
  .player-method {
    display: block;
    font-size: 9px;
    color: #9fb7a9;
    margin-top: 3px;
  }
  .card-count {
    color: #c9d9c7;
    font-size: 11px;
    min-width: 22px;
    text-align: center;
    border-left: 1px solid #8fad981f;
    margin-left: 4px;
    padding-left: 8px;
  }
  .active .player-badge {
    border-color: #afd29c;
    box-shadow: 0 0 0 3px #b4d49d0d;
  }
  .thinking {
    display: flex;
    justify-content: center;
    gap: 3px;
    margin-top: 7px;
  }
  .thinking i {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #b5d1a9;
    animation: pulse 1.2s infinite;
  }
  .thinking i:nth-child(2) {
    animation-delay: 0.2s;
  }
  .thinking i:nth-child(3) {
    animation-delay: 0.4s;
  }
  .center-stack {
    position: absolute;
    top: 166px;
    left: 50%;
    transform: translateX(-50%);
  }
  .direction {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 7px;
    color: #8eb09c;
    font-size: 9px;
    white-space: nowrap;
  }
  .direction > span {
    font-size: 21px;
  }
  .finished {
    color: #bdd0b1;
    font-size: 10px;
    padding: 16px 0;
  }
  .your-area {
    padding: 0 22px 18px;
    background: linear-gradient(#1b3027, #192b24);
    border-top: 1px solid #a0c6a52b;
  }
  .turn-line {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 17px 0;
    border-bottom: 1px solid #bdd3b311;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #8c9d93;
    flex-shrink: 0;
  }
  .your-turn {
    background: #c9e4a1;
    box-shadow: 0 0 0 4px #c9e4a112;
  }
  .turn-line strong {
    color: #dbe7d4;
    font-size: 12px;
  }
  .turn-hint {
    color: #899f90;
    font-size: 10px;
  }
  .move-count {
    margin-left: auto;
    color: #90a293;
    font-size: 10px;
    white-space: nowrap;
  }
  .hand-header {
    display: flex;
    justify-content: space-between;
    margin-top: 17px;
    font-size: 9px;
    font-weight: 550;
    letter-spacing: 0.12em;
    color: #93a88e;
  }
  .hand-header > span:last-child {
    letter-spacing: 0;
    font-weight: 400;
  }
  .your-hand {
    max-width: 100%;
    overflow-x: auto;
    padding: 0 0 8px;
  }
  .empty-hand {
    text-align: center;
    display: grid;
    align-content: center;
    height: 128px;
    color: #c8d7b9;
    font-size: 13px;
  }
  .hand-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .help-hint {
    color: #91a391;
    font-size: 9px;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .help-hint > span {
    display: grid;
    place-items: center;
    width: 13px;
    height: 13px;
    border: 1px solid #91a39166;
    border-radius: 50%;
    font:
      italic 10px Georgia,
      serif;
    flex-shrink: 0;
  }
  .action-buttons {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .take-button {
    border: 1px solid #8baf8555;
    background: #c0d7aa0b;
    color: #d7e7cc;
    white-space: nowrap;
  }
  .take-button span {
    margin-left: 10px;
  }
  .take-button:disabled {
    opacity: 0.35;
    cursor: default;
  }
  @keyframes pulse {
    50% {
      opacity: 0.25;
    }
  }
  @media (max-width: 1100px) {
    .opponent {
      width: 155px;
    }
    .opponent-1 {
      left: 10px;
    }
    .opponent-3 {
      right: 10px;
    }
    .opponent-2 {
      left: calc(50% - 77.5px);
    }
    .turn-hint {
      display: none;
    }
  }
  @media (max-width: 600px) {
    .table-toolbar {
      padding: 14px;
    }
    .round {
      font-size: 9px;
    }
    .reveal {
      font-size: 9px;
    }
    .felt {
      height: 345px;
    }
    .table-outline {
      inset: 26px 10px;
      border-radius: 100px;
    }
    .opponent {
      width: 118px;
    }
    .opponent-1 {
      left: 4px;
      top: 137px;
    }
    .opponent-3 {
      right: 4px;
      top: 137px;
    }
    .opponent-2 {
      left: calc(50% - 59px);
      top: 15px;
    }
    .player-badge {
      padding: 6px;
      gap: 5px;
    }
    .player-badge :global(.avatar) {
      width: 24px;
      height: 27px;
      font-size: 8px;
      border-radius: 6px;
    }
    .player-badge strong {
      font-size: 10px;
    }
    .player-method {
      font-size: 7px;
      max-width: 64px;
    }
    .card-count {
      margin: 0;
      padding-left: 5px;
      min-width: 15px;
      font-size: 9px;
    }
    .center-stack {
      top: 180px;
    }
    .direction {
      bottom: 8px;
      font-size: 8px;
    }
    .direction > span {
      font-size: 17px;
    }
    .your-area {
      padding: 0 13px 13px;
    }
    .turn-line {
      gap: 7px;
      padding: 14px 0;
    }
    .turn-line strong {
      font-size: 10px;
    }
    .move-count {
      font-size: 9px;
    }
    .hand-actions {
      flex-wrap: wrap;
      justify-content: center;
    }
    .help-hint {
      order: 2;
      font-size: 8px;
    }
    .hand-header {
      margin-top: 13px;
    }
    .felt-mark {
      top: 45%;
      font-size: 70px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .thinking i {
      animation: none;
    }
  }
</style>
