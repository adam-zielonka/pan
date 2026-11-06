<script lang="ts">
  import { tick } from 'svelte'
  import { tr, locale, setLanguage } from '../i18n'
  import BoardElement from './BoardElement.svelte'
  import { store } from '../engine/Store'
  import PlayerPickerDialog from './PlayerPickerDialog.svelte'
  import { PlayerType } from '../engine/PlayerType'
  import { strategies } from '../engine/strategies'

  const { game } = store
  let round = 0
  let isSetup = true
  let settingsDialog: HTMLDialogElement
  let rulesDialog: HTMLDialogElement
  let playerPicker: PlayerPickerDialog
  let selectedSeat = 0
  let allCardsVisible = false
  let selection = [...game.playersSelect]
  $: activeSeats = selection.filter(type => type !== PlayerType.None).length
  $: latestMove = $game.history.at(-1)
  async function openPlayerPicker(id: number): Promise<void> {
    if (!isSetup) return
    selectedSeat = id
    await tick()
    if (isSetup) playerPicker.show()
  }

  function choosePlayer(type: PlayerType): void {
    if (!isSetup) return
    if (selectedSeat === 0 && type === PlayerType.None) return
    if (selectedSeat !== 0 && type === PlayerType.Human) return
    if (
      type === PlayerType.None &&
      selection[selectedSeat] !== PlayerType.None &&
      activeSeats <= 2
    )
      return
    game.playersSelect.set(selectedSeat, type)
    selection = [...game.playersSelect]
    game.prepareGame()
  }
  function startGame(): void {
    if (!isSetup || activeSeats < 2) return
    playerPicker.close()
    isSetup = false
    round++
    game.newGame()
  }

  function prepareNextRound(): void {
    game.prepareGame()
    isSetup = true
    settingsDialog.close()
    rulesDialog.close()
  }
</script>

<svelte:head><title>{$tr('PAN — Twój stolik, Twoja strategia')}</title></svelte:head>

<div class="app-shell">
  <header class="app-header">
    <h1 class="brand"><span class="brand-icon" aria-hidden="true">♠</span>PAN</h1>
    <button
      class="button primary new-deal"
      on:click={isSetup ? startGame : prepareNextRound}
    >
      <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="8" y="3" width="12" height="18" rx="2" />
        <path d="M5 18H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1m7 6h4m-4 4h4" />
      </svg>
      {isSetup ? $tr('Rozdaj karty') : $tr('Nowe rozdanie')}
    </button>
    <nav aria-label={$tr('Ustawienia i pomoc')}>
      <button
        class="button subtle"
        on:click={() => settingsDialog.showModal()}
        aria-haspopup="dialog"
      >
        <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h4m4 0h10M3 12h10m4 0h4M3 18h4m4 0h10" />
          <circle cx="9" cy="6" r="2" />
          <circle cx="15" cy="12" r="2" />
          <circle cx="9" cy="18" r="2" />
        </svg>
        {$tr('Ustawienia')}
      </button>
      <button
        class="button subtle"
        on:click={() => rulesDialog.showModal()}
        aria-haspopup="dialog"
      >
        <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"
          />
        </svg>
        {$tr('Zasady gry')}
      </button>
    </nav>
  </header>

  <main>
    <BoardElement {round} {isSetup} chooseSeat={openPlayerPicker} bind:allCardsVisible />
    {#if !isSetup}<details class="activity-panel">
        <summary>
          <span>{$tr('Ostatnie ruchy')}</span>
          {#if latestMove}<span class="latest-move"
              >{$tr(strategies[$game.players[latestMove.player].type].name)} · {$tr(
                latestMove.action,
              )}</span
            >{/if}
        </summary>
        <div class="activity-list" aria-label={$tr('Historia ruchów')}>
          {#if !$game.history.length}<p>
              {$tr('Karty rozdane. Czas na pierwszy ruch.')}
            </p>{/if}
          {#each $game.history.slice(-4).reverse() as entry, i}
            {@const strategy = strategies[$game.players[entry.player].type]}
            <div class="activity-row" class:latest={i === 0}>
              <span class={`activity-dot ${strategy.color}`} aria-hidden="true"></span>
              <span>{$tr(strategy.name)}</span><strong>{$tr(entry.action)}</strong>
            </div>
          {/each}
        </div>
      </details>{/if}
  </main>
</div>

<dialog bind:this={settingsDialog} aria-labelledby="settings-title">
  <div class="dialog-heading">
    <h2 id="settings-title">{$tr('Ustawienia')}</h2>
    <button
      class="close-button"
      on:click={() => settingsDialog.close()}
      aria-label={$tr('Zamknij ustawienia')}>×</button
    >
  </div>
  <section aria-label={$tr('Ustawienia')}>
    <div class="setting-row pace-row">
      <span id="pace-label">{$tr('Tempo gry')}</span>
      <div class="pace-options" role="group" aria-labelledby="pace-label">
        {#each [{ value: 1200, label: 'Spokojne' }, { value: 650, label: 'Normalne' }, { value: 200, label: 'Szybkie' }] as pace}
          <button
            type="button"
            aria-pressed={game.thinkDelay === pace.value}
            on:click={() => (game.thinkDelay = pace.value)}>{$tr(pace.label)}</button
          >
        {/each}
      </div>
    </div>
    <label class="reveal setting-row"
      ><span>{$tr('Pokaż karty rywali')}</span><input
        type="checkbox"
        bind:checked={allCardsVisible}
      /></label
    >
    <div class="setting-row language-row">
      <span id="language-label">Language / Język</span>
      <div class="language-switch" role="group" aria-labelledby="language-label">
        <button
          type="button"
          lang="pl"
          aria-pressed={$locale === 'pl'}
          on:click={() => setLanguage('pl')}>Polski</button
        >
        <button
          type="button"
          lang="en"
          aria-pressed={$locale === 'en'}
          on:click={() => setLanguage('en')}>English</button
        >
      </div>
    </div>
  </section>
</dialog>

<PlayerPickerDialog
  bind:this={playerPicker}
  enabled={isSetup}
  seat={selectedSeat}
  player={selection[selectedSeat]}
  canRemove={selection[selectedSeat] === PlayerType.None || activeSeats > 2}
  select={choosePlayer}
/>

<dialog bind:this={rulesDialog} aria-labelledby="rules-title">
  <div class="dialog-heading">
    <h2 id="rules-title">{$tr('Jak grać w Pana?')}</h2>
    <button
      class="close-button"
      on:click={() => rulesDialog.close()}
      aria-label={$tr('Zamknij zasady')}>×</button
    >
  </div>
  <div class="rules-grid">
    <p>
      <b>{$tr('01 · Zacznij od dziewiątki')}</b>{$tr(
        'Talia ma 24 karty, od 9 do asa. Rozpoczyna osoba z 9♥, wykładając ją na stół.',
      )}
    </p>
    <p>
      <b>{$tr('02 · Równo lub wyżej')}</b>{$tr(
        'Zagraj kartę o tej samej lub wyższej figurze. Możesz też dobrać do 3 kart ze stosu — 9♥ zostaje na stole.',
      )}
    </p>
    <p>
      <b>{$tr('03 · Wykorzystaj serię')}</b>{$tr(
        'Po zagraniu karty możesz dołożyć trzy pozostałe tej samej figury. Rozpoczętą serię trzeba dokończyć. Dla dziewiątek działa też uzupełnienie parą przy dwóch kartach na stosie.',
      )}
    </p>
    <p>
      <b>{$tr('04 · Nie zostań ostatni')}</b>{$tr(
        'Pik na wierzchu oddaje ruch w lewo, pozostałe kolory w prawo. Gracze bez kart odpadają. Ostatnia osoba z kartami przegrywa.',
      )}
    </p>
  </div>
</dialog>

<style>
  @font-face {
    font-family: 'DM Sans';
    src: url('../assets/fonts/DMSans.ttf') format('truetype');
    font-style: normal;
    font-weight: 100 1000;
    font-display: swap;
  }
  :global(:root) {
    font-family: 'DM Sans', 'Segoe UI', system-ui, sans-serif;
    color: #e7e9dd;
    background: #111b18;
    font-synthesis: none;
    --text: #e7e9dd;
    --muted: #8c9b90;
    --line: #c5d3b513;
    color-scheme: dark;
  }
  :global(*) {
    box-sizing: border-box;
  }
  :global(body) {
    margin: 0;
    min-width: 320px;
    background: radial-gradient(ellipse at 15% 0, #24372a3b, transparent 55%), #111b18;
  }
  :global(button),
  :global(select),
  :global(input) {
    font: inherit;
  }
  :global(button),
  :global(a),
  :global(select),
  :global(input) {
    -webkit-tap-highlight-color: transparent;
  }
  :global(button:focus-visible),
  :global(a:focus-visible),
  :global(select:focus-visible),
  :global(input:focus-visible) {
    outline: 2px solid #c5dda9;
    outline-offset: 4px;
  }
  :global(button) {
    color: inherit;
  }
  :global(select option) {
    background: #1c2a23;
    color: var(--text);
  }
  :global(.mint) {
    background: #b6d5b51c;
    color: #c2dcb5;
  }
  :global(.amber) {
    background: #d9b4791c;
    color: #d9be84;
  }
  :global(.blue) {
    background: #a5c0dd1c;
    color: #b5cbe5;
  }
  :global(.lilac) {
    background: #c9b0e11c;
    color: #d1bee7;
  }
  :global(.rose) {
    background: #d996a01c;
    color: #e2a4ad;
  }
  :global(.orange) {
    background: #e6b2911c;
    color: #e6b291;
  }
  :global(.gray) {
    background: #9eaaa21c;
    color: #aab6af;
  }
  :global(.button) {
    min-height: 44px;
    border-radius: 7px;
    padding: 11px 17px;
    font-size: 14px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition:
      background 150ms,
      transform 150ms;
  }
  :global(.button:not(:disabled):active) {
    transform: translateY(1px);
  }
  :global(.button.primary) {
    background: #d1dfb4;
    color: #233629;
    border: 1px solid #d1dfb4;
    box-shadow: 0 3px 10px #0002;
  }
  :global(.button.primary:hover) {
    background: #e0eacb;
  }
  :global(.button:disabled) {
    opacity: 0.4;
    cursor: default;
  }
  :global(.button.small) {
    font-size: 13px;
    padding: 9px 11px;
  }
  :global(.button.subtle) {
    background: transparent;
    border: 1px solid #8baf8544;
    color: #cadac2;
  }

  .app-shell {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px 20px;
  }
  .app-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 0;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 auto 0 0;
    color: #f0eddb;
    font:
      28px Georgia,
      serif;
    letter-spacing: 5px;
  }
  .brand-icon {
    display: grid;
    place-items: center;
    width: 29px;
    height: 38px;
    border: 1px solid #b9c6a7;
    border-radius: 5px;
    transform: rotate(-9deg);
    font-size: 25px;
    letter-spacing: 0;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .button-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  dialog {
    width: min(640px, calc(100% - 24px));
    max-height: calc(100dvh - 32px);
    padding: 0 24px 20px;
    color: var(--text);
    background: #1a2921;
    border: 1px solid #60785c;
    border-radius: 16px;
    box-shadow: 0 20px 80px #0006;
    overscroll-behavior: contain;
  }
  dialog::backdrop {
    background: #07110dd9;
  }
  :global(body:has(dialog[open])) {
    overflow: hidden;
  }
  .dialog-heading {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #1a2921;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
  }
  h2 {
    font-size: 19px;
    font-weight: 550;
    margin: 0;
  }
  .close-button {
    display: grid;
    place-items: center;
    min-width: 44px;
    min-height: 44px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: transparent;
    font-size: 26px;
    cursor: pointer;
  }
  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 60px;
    border-bottom: 1px solid var(--line);
    font-size: 14px;
  }
  .pace-row,
  .language-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 14px 0;
  }
  .pace-options,
  .language-switch {
    display: flex;
    gap: 6px;
  }
  .pace-options button,
  .language-switch button {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    padding: 8px 6px;
    border: 1px solid #637b5b;
    border-radius: 7px;
    background: transparent;
    color: #c8d4bb;
    font-size: 14px;
    cursor: pointer;
  }
  .pace-options button[aria-pressed='true'],
  .language-switch button[aria-pressed='true'] {
    background: #d1dfb4;
    color: #233629;
    border-color: #d1dfb4;
    font-weight: 650;
  }
  .pace-options button:not([aria-pressed='true']):hover,
  .language-switch button:not([aria-pressed='true']):hover {
    background: #304333;
  }
  .reveal {
    cursor: pointer;
  }
  .reveal input {
    width: 22px;
    height: 22px;
    accent-color: #c5dda9;
    margin: 11px;
  }
  summary {
    min-height: 44px;
    padding: 13px 0;
    cursor: pointer;
    font-size: 14px;
    color: #cadac2;
  }
  summary:focus-visible {
    outline: 2px solid #c5dda9;
    outline-offset: 3px;
    border-radius: 4px;
  }
  .activity-panel {
    margin-top: 10px;
    padding: 0 16px;
    border: 1px solid var(--line);
    border-radius: 10px;
  }
  .latest-move {
    float: right;
    color: #b2c0a8;
  }
  .activity-list {
    padding-bottom: 12px;
  }
  .activity-list p {
    font-size: 13px;
    color: #b2c0a8;
  }
  .activity-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    font-size: 14px;
    color: #b2c0a8;
  }
  .activity-row strong {
    margin-left: auto;
    font-weight: 500;
  }
  .activity-row.latest {
    color: var(--text);
  }
  .activity-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
  .rules-grid {
    display: grid;
    gap: 4px;
  }
  .rules-grid p {
    font-size: 15px;
    line-height: 1.7;
    color: #c0ceb6;
    margin: 14px 0 0;
  }
  .rules-grid b {
    display: block;
    color: var(--text);
    margin-bottom: 5px;
  }
  @media (max-width: 600px) {
    .app-shell {
      padding: 0 10px 14px;
    }
    .app-header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px;
      padding: 8px 2px;
    }
    .brand {
      font-size: 24px;
    }
    .brand-icon {
      width: 24px;
      height: 32px;
      font-size: 21px;
    }
    .new-deal {
      grid-column: 2;
      grid-row: 1;
    }
    nav {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    dialog {
      padding: 0 16px 16px;
    }
    .latest-move {
      max-width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.button) {
      transition: none;
    }
  }
</style>
