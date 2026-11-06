<script lang="ts">
  import { tr } from '../i18n'
  import StackElement from './StackElement.svelte'
  import PlayerElement from './PlayerElement.svelte'
  import { store } from '../engine/Store'
  import { PlayerType } from '../engine/PlayerType'
  import { strategies } from '../engine/strategies'

  const { game } = store
  export let round = 1
  export let isSetup = false
  export let startGame: () => void = () => game.newGame()
  export let chooseSeat: (id: number) => void = () => {}
  export let allCardsVisible = false
  export let newGame: () => void = () => game.newGame()
  $: humanTurn =
    !isSetup && !$game.isGameOver && $game.players[$game.token]?.type === PlayerType.Human
  $: current = strategies[$game.players[$game.token]?.type || PlayerType.Human]
  $: me = $game.players[0]
  $: loser = $game.players.find(player => player.isPlaying)
  $: canTake = humanTurn && $game.isPossibleToGetCardFromStack()
  $: combo = $game.isComboModeRady || $game.isComboMode
  $: status = isSetup
    ? $tr('Wybierz graczy i rozdaj karty.')
    : $game.deck.length
      ? $tr('Rozdajemy karty…')
      : $game.isGameOver
        ? $tr('Koniec rozdania · {result}', {
            result:
              loser?.id === 0 && me.type === PlayerType.Human
                ? $tr('Zostajesz z kartami')
                : $tr('{name} zostaje z kartami', {
                    name: $tr(strategies[loser?.type || PlayerType.None].name),
                  }),
          })
        : humanTurn
          ? combo
            ? $tr('Możesz zagrać serię')
            : $tr('Twój ruch')
          : $tr('{name} wybiera ruch…', { name: $tr(current.name) })
</script>

<section class="game-board" aria-label={$tr('Stół do gry')}>
  <div class="table-toolbar">
    <div class="round">
      <span class="live-dot"></span>
      {#if isSetup}{$tr('PRZYGOTOWANIE')}{:else}{$tr('ROZDANIE')}
        {String(round).padStart(2, '0')}{/if}
    </div>
  </div>
  <div class="felt">
    <div class="table-outline"></div>
    <div class="felt-mark" aria-hidden="true">
      P<span>A</span>N<small>{$tr('KLASYCZNA GRA KARCIANA')}</small>
    </div>
    {#each $game.players.slice(1) as player}
      {@const strategy = strategies[player.type]}
      <div
        class={`opponent opponent-${player.id}`}
        class:active={!isSetup && !$game.isGameOver && player.id === $game.token}
      >
        <button
          type="button"
          class="player-badge"
          class:empty-seat={player.type === PlayerType.None}
          data-seat={player.id}
          disabled={!isSetup}
          aria-haspopup={isSetup ? 'dialog' : undefined}
          aria-label={isSetup
            ? $tr('Wybierz gracza: {name} · fotel {seat}', {
                name: $tr(strategy.name),
                seat: player.id + 1,
              })
            : $tr(strategy.name)}
          aria-describedby={[
            !isSetup && player.type !== PlayerType.None ? `seat-${player.id}-cards` : '',
            player.type === PlayerType.AZ ? `seat-${player.id}-knowledge` : '',
          ]
            .filter(Boolean)
            .join(' ') || undefined}
          on:click={() => chooseSeat(player.id)}
        >
          <span class={`avatar ${strategy.color}`} aria-hidden="true"
            >{$tr(strategy.initials)}</span
          >
          <strong
            >{player.type === PlayerType.None
              ? $tr(isSetup ? 'Dodaj gracza' : 'Wolne miejsce')
              : $tr(strategy.name)}</strong
          >
          {#if player.type !== PlayerType.None}<span
              class="card-count"
              class:placeholder={isSetup}
              id={`seat-${player.id}-cards`}
              aria-hidden={isSetup ? true : undefined}
              aria-label={isSetup
                ? undefined
                : $tr('{count} kart', { count: player.cards.length })}
              >{player.cards.length || '✓'}</span
            >{:else}<span class="add-mark" class:placeholder={!isSetup} aria-hidden="true"
              >+</span
            >{/if}
          {#if player.type === PlayerType.AZ}
            <span class="player-knowledge" id={`seat-${player.id}-knowledge`}
              >{$tr('Zna wszystkie ręce')}</span
            >
          {/if}
        </button>
        <div class="opponent-hand" class:concealed={!allCardsVisible}>
          {#if player.cards.length}
            <PlayerElement cards={player.cards} hidden={!allCardsVisible} compact />
          {:else if !isSetup && !$game.deck.length && player.type !== PlayerType.None}
            <div class="finished">{$tr('Poza grą ✓')}</div>
          {/if}
        </div>
        {#if !isSetup && !$game.isGameOver && player.id === $game.token}<div
            class="thinking"
          >
            <i></i><i></i><i></i>
          </div>{/if}
      </div>
    {/each}
    <div class="center-stack">
      {#if isSetup}<p class="setup-prompt">
          {$tr('Kliknij miejsce przy stole, aby wybrać gracza.')}
        </p>{:else}<StackElement />{/if}
    </div>
    {#if !isSetup}<div class="direction">
        <span>{$game.stack.isPikOnTop ? '↶' : '↷'}</span>{$game.stack.isPikOnTop
          ? $tr('Pik · ruch w lewo')
          : $tr('Ruch w prawo')}
      </div>{/if}
  </div>
  <div class="your-area">
    <div class="turn-line">
      <div class="turn-status" role="status" aria-live="polite">
        <span class:your-turn={humanTurn} class="status-dot"></span>
        <div class="status-copy">
          <strong>{status}</strong>
          {#if humanTurn}<span class="turn-hint"
              >{combo
                ? $tr('Zagraj tę samą figurę')
                : $tr('Wybierz podświetloną kartę')}</span
            >{/if}
        </div>
      </div>
      <button
        type="button"
        class="player-badge own-seat"
        class:current-turn={!isSetup && !$game.isGameOver && $game.token === 0}
        data-seat="0"
        disabled={!isSetup}
        aria-haspopup={isSetup ? 'dialog' : undefined}
        aria-label={isSetup
          ? $tr('Wybierz gracza: {name} · fotel {seat}', {
              name: $tr(strategies[me.type].name),
              seat: 1,
            })
          : $tr(strategies[me.type].name)}
        aria-describedby={[
          !isSetup ? 'seat-0-cards' : '',
          me.type === PlayerType.AZ ? 'seat-0-knowledge' : '',
          !isSetup && me.type !== PlayerType.Human ? 'seat-0-observing' : '',
        ]
          .filter(Boolean)
          .join(' ') || undefined}
        on:click={() => chooseSeat(0)}
      >
        <span class={`avatar ${strategies[me.type].color}`} aria-hidden="true"
          >{$tr(strategies[me.type].initials)}</span
        >
        <strong>{$tr(strategies[me.type].name)}</strong>
        {#if !isSetup}<span
            class="card-count"
            id="seat-0-cards"
            aria-label={$tr('{count} kart', { count: me.cards.length })}
            >{me.cards.length}</span
          >{/if}
        {#if !isSetup && me.type !== PlayerType.Human}<span
            class="seat-context"
            id="seat-0-observing">{$tr('Obserwujesz grę')}</span
          >{/if}
        {#if me.type === PlayerType.AZ}<span
            class="player-knowledge"
            id="seat-0-knowledge">{$tr('Zna wszystkie ręce')}</span
          >{/if}
      </button>
      {#if !isSetup}<span class="move-count">{$tr('Ruch')} {$game.moveCount}</span>{/if}
    </div>
    <div class="your-hand">
      {#if me.cards.length}
        <PlayerElement
          cards={me.cards}
          move={card => me.makeAction(game, card)}
          possible={card => humanTurn && game.isPossibleToMoveCard(me, card)}
        />
      {:else if !isSetup}
        <div class="empty-hand">
          {$game.deck.length
            ? $tr('Za chwilę dostaniesz karty.')
            : $tr('Wszystkie karty zagrane. Dobra robota! ♡')}
        </div>
      {/if}
    </div>
    <div class="hand-actions">
      {#if isSetup}<button type="button" class="button primary" on:click={startGame}
          >{$tr('Rozdaj karty')}</button
        >
      {:else if !$game.deck.length && $game.isGameOver}
        <button type="button" class="button primary" on:click={newGame}
          >{$tr('Nowe rozdanie')}</button
        >
      {:else}
        {#if humanTurn && $game.isComboModeRady && !$game.isComboMode}
          <button
            type="button"
            class="button subtle"
            on:click={() => me.makeAction(game, 'skip')}>{$tr('Pomiń serię')}</button
          >
        {/if}
        <button
          type="button"
          class="button take-button"
          disabled={!canTake}
          on:click={() => me.makeAction(game, 'stack')}
          >{$tr('Dobierz {count} ze stosu', {
            count: $game.stack.numberOfCardsThatCanBeGetFromStack || '',
          })}
          <span aria-hidden="true">↓</span></button
        >
      {/if}
    </div>
  </div>
</section>

<style>
  .game-board {
    min-width: 0;
    max-width: 100%;
    border: 1px solid #3e5b4a;
    border-radius: 16px;
    overflow: hidden;
    background: #182722;
    box-shadow: 0 20px 60px #0002;
  }
  .table-toolbar {
    display: flex;
    align-items: center;
    min-height: 38px;
    padding: 8px 20px;
    border-bottom: 1px solid #b9d4ba0d;
  }
  .round {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #bdc9ba;
  }
  .live-dot {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background: #aac598;
    box-shadow: 0 0 8px #aac59855;
  }
  .felt {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: auto minmax(152px, 1fr) auto;
    gap: 14px 16px;
    min-height: 332px;
    padding: 14px 20px 8px;
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
    inset: 22px 28px;
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
      9px system-ui,
      sans-serif;
    letter-spacing: 4px;
  }
  .opponent {
    position: relative;
    width: min(180px, 100%);
    min-width: 0;
    justify-self: center;
    align-self: start;
    text-align: center;
  }
  .opponent-1 {
    grid-row: 2;
    grid-column: 1;
  }
  .opponent-2 {
    grid-row: 1;
    grid-column: 1;
  }
  .opponent-3 {
    grid-row: 1;
    grid-column: 2;
  }
  .opponent-4 {
    grid-row: 1;
    grid-column: 3;
  }
  .opponent-5 {
    grid-row: 2;
    grid-column: 3;
  }
  .player-badge {
    width: 100%;
    cursor: pointer;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 4px 8px;
    min-height: 44px;
    padding: 6px 10px;
    border: 1px solid #9bb7a733;
    border-radius: 10px;
    background: #102b22d9;
    text-align: left;
    box-shadow: 0 3px 10px #0001;
  }
  .player-badge:not(:disabled):hover {
    border-color: #c2e3a8;
    background: #193b2d;
  }
  .player-badge:disabled {
    cursor: default;
    opacity: 1;
  }
  .setup-prompt {
    width: 220px;
    max-width: 100%;
    margin: 0 auto;
    color: #c1d4c4;
    text-align: center;
    font-size: 14px;
    line-height: 1.6;
  }
  .player-badge.empty-seat {
    border-style: dashed;
    background: #102b2255;
  }
  .add-mark {
    font-size: 20px;
    color: #bbcebc;
  }
  .own-seat {
    width: 180px;
    background: #33563d;
    border-color: #94b681;
  }
  .own-seat:not(:disabled):hover {
    background: #3c6345;
    border-color: #d5edbd;
  }
  .own-seat.current-turn {
    border-color: #d5edbd;
    box-shadow: 0 0 0 2px #b4d49d40;
  }
  .seat-context {
    grid-column: 1 / -1;
    color: #d3e3c4;
    font-size: 12px;
    line-height: 17px;
  }
  .player-badge :global(.avatar) {
    width: 28px;
    height: 28px;
    font-size: 11px;
    border-radius: 8px;
  }
  .player-badge strong {
    color: #e2eadb;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .player-knowledge {
    grid-column: 1 / -1;
    color: #dcc9ef;
    font-size: 13px;
    line-height: 17px;
    font-weight: 500;
    letter-spacing: 0;
  }
  .card-count {
    color: #e1ecda;
    font-size: 14px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    min-width: 24px;
    text-align: center;
    border-left: 1px solid #8fad9844;
    padding-left: 8px;
  }
  .placeholder {
    visibility: hidden;
  }
  .active .player-badge {
    border-color: #c2e3a8;
    box-shadow: 0 0 0 2px #b4d49d26;
  }
  .opponent-hand {
    /* Reserve the hand and scrollbar space before dealing so seats stay put. */
    height: 82px;
    min-width: 0;
    max-width: 100%;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: thin;
    scrollbar-color: #789985 #173b2b;
  }
  .thinking {
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 4px;
    padding: 3px 7px;
    border-radius: 8px;
    background: #173b2b;
  }
  .thinking i {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #d5edbd;
    animation: pulse 1.2s infinite;
  }
  .thinking i:nth-child(2) {
    animation-delay: 0.2s;
  }
  .thinking i:nth-child(3) {
    animation-delay: 0.4s;
  }
  .center-stack {
    grid-row: 2;
    grid-column: 2;
    min-width: 0;
    align-self: center;
  }
  .direction {
    grid-row: 3;
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    color: #c1d4c4;
    font-size: 13px;
    line-height: 22px;
    white-space: nowrap;
  }
  .direction > span {
    font-size: 22px;
  }
  .finished {
    color: #cbdcbe;
    font-size: 13px;
    line-height: 18px;
    padding: 12px 0;
  }
  .your-area {
    min-width: 0;
    padding: 0 20px 14px;
    background: linear-gradient(#1b3027, #192b24);
    border-top: 1px solid #a0c6a52b;
  }
  .turn-line {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    padding: 11px 0;
    border-bottom: 1px solid #bdd3b326;
  }
  .turn-status {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #8c9d93;
  }
  .your-turn {
    background: #c9e4a1;
    box-shadow: 0 0 0 4px #c9e4a112;
  }
  .status-copy {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 2px 12px;
    min-width: 0;
    line-height: 20px;
  }
  .status-copy strong {
    color: #e1edd9;
    font-size: 14px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .turn-hint {
    color: #bbcebc;
    font-size: 13px;
  }
  .move-count {
    justify-self: end;
    color: #b8cbb8;
    font-size: 13px;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .your-hand {
    min-width: 0;
    max-width: 100%;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: thin;
    scrollbar-color: #789985 #192b24;
    padding-bottom: 4px;
  }
  .empty-hand {
    text-align: center;
    display: grid;
    align-content: center;
    min-height: 128px;
    color: #c8d7b9;
    font-size: 14px;
    line-height: 20px;
  }
  .hand-actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding-top: 2px;
  }
  .hand-actions .button {
    min-height: 44px;
    min-width: 44px;
    padding: 10px 14px;
    font-size: 14px;
    line-height: 20px;
  }
  .take-button {
    border: 1px solid #8baf8580;
    background: #c0d7aa0b;
    color: #e2eedb;
  }
  .take-button span {
    margin-left: 4px;
  }
  .take-button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  @keyframes pulse {
    50% {
      opacity: 0.25;
    }
  }
  @media (max-width: 760px) {
    .table-toolbar {
      min-height: 36px;
      padding: 7px 12px;
    }
    .felt {
      grid-template-rows: auto auto auto auto;
      gap: 6px;
      min-height: 0;
      padding: 8px 10px 6px;
    }
    .table-outline {
      inset: 18px 8px;
      border-radius: 70px;
    }
    .opponent-hand.concealed {
      height: 42px;
    }
    .opponent-hand.concealed :global(.hand) {
      display: none;
    }
    .player-badge {
      grid-template-columns: minmax(0, 1fr) auto;
      padding: 6px;
      gap: 4px;
      border-radius: 8px;
    }
    .player-badge :global(.avatar) {
      display: none;
    }
    .card-count {
      min-width: 20px;
      padding-left: 4px;
    }
    .center-stack {
      grid-column: 1 / -1;
      grid-row: 3;
    }
    .direction {
      grid-row: 4;
    }
    .your-area {
      padding: 0 12px 12px;
    }
    .status-copy {
      display: grid;
      gap: 1px;
    }
    .turn-line {
      grid-template-columns: minmax(0, 1fr) 120px auto;
      align-items: center;
      padding: 8px 0;
      gap: 8px;
    }
    .own-seat {
      width: 120px;
    }
    .turn-status {
      align-items: flex-start;
      gap: 8px;
    }
    .status-dot {
      align-self: start;
      margin-top: 7px;
    }
    .hand-actions .button {
      padding-inline: 10px;
    }
    .felt-mark {
      top: 55%;
      font-size: 70px;
    }
  }
  @media (max-width: 600px) {
    .opponent-hand {
      height: 71px;
    }
    .empty-hand {
      min-height: 110px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .thinking i {
      animation: none;
    }
  }
</style>
