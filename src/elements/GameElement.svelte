<script lang="ts">
  import { tr, locale, setLanguage } from '../i18n'
  import BoardElement from './BoardElement.svelte'
  import { store } from '../engine/Store'
  import PlayerSelectElement from './PlayerSelectElement.svelte'
  import { PlayerType } from '../engine/PlayerType'
  import { strategies } from '../engine/strategies'

  const { game } = store
  let round = 1
  let settingsDialog: HTMLDialogElement
  let rulesDialog: HTMLDialogElement
  let allCardsVisible = false
  let selection = [...game.playersSelect]
  $: activeSeats = selection.filter(type => type !== PlayerType.None).length
  $: pendingChanges = selection.some((type, id) => type !== $game.players[id]?.type)
  $: latestMove = $game.history.at(-1)
  const bots = Object.values(PlayerType).filter(
    type => type !== PlayerType.Human && type !== PlayerType.None,
  )

  function setPlayer(id: number, type: PlayerType): void {
    game.playersSelect.set(id, type)
    selection = [...game.playersSelect]
  }
  function newGame(): void {
    if (activeSeats < 2) {
      if (!settingsDialog.open) settingsDialog.showModal()
      return
    }
    game.newGame()
    round++
    settingsDialog.close()
    rulesDialog.close()
  }
</script>

<svelte:head><title>{$tr('PAN — Twój stolik, Twoja strategia')}</title></svelte:head>

<div class="app-shell">
  <header class="app-header">
    <h1 class="brand"><span class="brand-icon" aria-hidden="true">♠</span>PAN</h1>
    <nav aria-label={$tr('Ustawienia i pomoc')}>
      <button
        class="button subtle"
        on:click={() => settingsDialog.showModal()}
        aria-label={pendingChanges
          ? `${$tr('Ustawienia')} · ${$tr('Nowy skład czeka')}`
          : $tr('Ustawienia')}
        aria-haspopup="dialog"
      >
        {$tr('Ustawienia')}
        {#if pendingChanges}<span class="pending-dot" aria-hidden="true"></span>{/if}
      </button>
      <button
        class="button subtle"
        on:click={() => rulesDialog.showModal()}
        aria-haspopup="dialog">{$tr('Zasady gry')}</button
      >
    </nav>
    <button class="button primary new-deal" on:click={newGame}
      >{$tr('Nowe rozdanie')}</button
    >
  </header>

  <main>
    <BoardElement {round} {newGame} bind:allCardsVisible />
    <details class="activity-panel">
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
    </details>
  </main>
</div>

<dialog bind:this={settingsDialog} aria-labelledby="settings-title">
  <div class="dialog-heading">
    <h2 id="settings-title">{$tr('Gracze i tempo')}</h2>
    <button
      class="close-button"
      on:click={() => settingsDialog.close()}
      aria-label={$tr('Zamknij ustawienia')}>×</button
    >
  </div>
  <section aria-label={$tr('Przy Twoim stole')}>
    {#each selection as player, id}<PlayerSelectElement
        {id}
        {player}
        set={setPlayer}
      />{/each}
    <div class="setting-row">
      <label for="pace">{$tr('Tempo gry')}</label>
      <select id="pace" bind:value={game.thinkDelay}>
        <option value={1200}>{$tr('Spokojne')}</option>
        <option value={650}>{$tr('Normalne')}</option>
        <option value={200}>{$tr('Szybkie')}</option>
      </select>
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
  <div class="settings-actions">
    <p class:pending={pendingChanges} role="status">
      {activeSeats < 2
        ? $tr('Wybierz co najmniej dwóch graczy.')
        : pendingChanges
          ? $tr('Nowy skład czeka')
          : $tr('Zmiany składu zadziałają od nowego rozdania.')}
    </p>
    {#if pendingChanges}<button
        class="button primary"
        disabled={activeSeats < 2}
        on:click={newGame}>{$tr('Zastosuj i rozpocznij nowe rozdanie')}</button
      >{/if}
  </div>
  <details class="players-guide">
    <summary>{$tr('Poznaj graczy')}</summary>
    <div class="strategy-grid">
      {#each bots as type}
        {@const strategy = strategies[type]}
        <article class="strategy-card">
          <div class="strategy-heading">
            <span class={`avatar ${strategy.color}`} aria-hidden="true"
              >{$tr(strategy.initials)}</span
            >
            <div>
              <h3>{$tr(strategy.name)}</h3>
              <span class="method">{$tr(strategy.method)}</span>
            </div>
          </div>
          <p>{$tr(strategy.description)}</p>
          <div class="knowledge" class:full-knowledge={type === PlayerType.AZ}>
            {$tr(strategy.information)}
          </div>
        </article>
      {/each}
    </div>
    <p class="strategy-note">
      {$tr(
        'Algorytmy są eksperymentalne. Opisy mówią, jak wybierają ruchy — nie są rankingiem siły gry. Symulacje mają ograniczoną liczbę kroków, a niedokończone partie oceniają na podstawie kart pozostałych w ręce.',
      )}
    </p>
  </details>
</dialog>

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
  :global(.avatar) {
    width: 39px;
    height: 41px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    border: 1px solid #ffffff0d;
    border-radius: 11px;
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.03em;
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
    gap: 8px;
  }
  .pending-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #dfc791;
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
  select {
    min-height: 44px;
    padding: 8px;
    border: 1px solid #637b5b;
    border-radius: 6px;
    background: #14231a;
    color: var(--text);
    max-width: 55%;
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
  .language-switch {
    display: flex;
    gap: 4px;
  }
  .language-switch button {
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .language-switch button[aria-pressed='true'] {
    border-color: #829576;
    background: #304333;
    font-weight: 600;
    text-decoration: none;
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
  .settings-actions {
    border-top: 1px solid var(--line);
    padding-top: 12px;
  }
  .settings-actions p {
    font-size: 13px;
    line-height: 1.6;
    color: #b2c0a8;
    margin: 0;
  }
  .settings-actions p.pending {
    color: #efcf91;
  }
  .settings-actions .button {
    margin-top: 12px;
    width: 100%;
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
  .strategy-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 8px 0;
  }
  .strategy-card {
    padding: 16px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: #23362a;
  }
  .strategy-heading {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  h3 {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 550;
  }
  .method,
  .knowledge {
    font-size: 12px;
    color: #b6c9a6;
  }
  .strategy-card p,
  .strategy-note {
    font-size: 14px;
    line-height: 1.7;
    color: #b2c0a8;
  }
  .knowledge {
    border-top: 1px solid var(--line);
    padding-top: 10px;
  }
  .full-knowledge {
    color: #e2c9f4;
    font-weight: 600;
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
      padding: 10px 2px;
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
    }
    nav .button {
      flex: 1;
    }
    dialog {
      padding: 0 16px 16px;
    }
    .strategy-grid {
      grid-template-columns: 1fr;
    }
    .language-row {
      flex-wrap: wrap;
      gap: 0 8px;
      padding: 8px 0;
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
