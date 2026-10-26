<script lang="ts">
  import BoardElement from './BoardElement.svelte'
  import { store } from '../engine/Store'
  import PlayerSelectElement from './PlayerSelectElement.svelte'
  import { PlayerType } from '../engine/PlayerType'
  import { strategies } from '../engine/strategies'

  const { game } = store
  let round = 1
  let view: 'table' | 'players' = 'table'
  let showRules = false
  let selection = [...game.playersSelect]
  $: activeSeats = selection.filter(type => type !== PlayerType.None).length
  $: pendingChanges = selection.some((type, id) => type !== $game.players[id]?.type)
  const bots = Object.values(PlayerType).filter(
    type => type !== PlayerType.Human && type !== PlayerType.None,
  )

  function setPlayer(id: number, type: PlayerType): void {
    game.playersSelect.set(id, type)
    selection = [...game.playersSelect]
  }
  function newGame(): void {
    if (activeSeats < 2) return
    game.newGame()
    round++
    view = 'table'
  }
</script>

<svelte:head><title>PAN — Twój stolik, Twoja strategia</title></svelte:head>

<div class="app-shell">
  <header class="app-header">
    <a href="./" class="brand" aria-label="PAN — strona główna"
      ><span class="brand-icon">♠</span><span
        >PAN<small>KLASYCZNIE. PO SWOJEMU.</small></span
      ></a
    >
    <nav aria-label="Widok aplikacji">
      <button class:selected={view === 'table'} on:click={() => (view = 'table')}
        >Stół do gry</button
      >
      <button class:selected={view === 'players'} on:click={() => (view = 'players')}
        >Poznaj graczy <span>6</span></button
      >
    </nav>
    <button
      class="rules-link"
      on:click={() => (showRules = !showRules)}
      aria-expanded={showRules}><span>?</span> Zasady gry</button
    >
  </header>

  <main>
    <div class="page-heading">
      <div>
        <div class="eyebrow">MAŁA TALIA. WIELE MOŻLIWOŚCI.</div>
        <h1>{view === 'table' ? 'Usiądź przy stole.' : 'Każdy gra po swojemu.'}</h1>
        <p>
          {view === 'table'
            ? 'Ty, 24 karty i przeciwnicy z charakterem.'
            : 'Sześć strategii. Sześć osobowości. Wybierz swoje towarzystwo.'}
        </p>
      </div>
      <button class="button primary" on:click={newGame} disabled={activeSeats < 2}
        ><span class="shuffle-icon">⤨</span> Nowe rozdanie</button
      >
    </div>

    {#if showRules}
      <section class="rules-panel" aria-label="Zasady gry">
        <div class="section-heading">
          <h2>Jak grać w Pana?</h2>
          <button
            class="close-button"
            on:click={() => (showRules = false)}
            aria-label="Zamknij zasady">×</button
          >
        </div>
        <div class="rules-grid">
          <p>
            <b>01 · Zacznij od dziewiątki</b>Talia ma 24 karty, od 9 do asa. Rozpoczyna
            osoba z 9♥, wykładając ją na stół.
          </p>
          <p>
            <b>02 · Równo lub wyżej</b>Zagraj kartę o tej samej lub wyższej figurze.
            Możesz też dobrać do 3 kart ze stosu — 9♥ zostaje na stole.
          </p>
          <p>
            <b>03 · Wykorzystaj serię</b>Po zagraniu karty możesz dołożyć trzy pozostałe
            tej samej figury. Rozpoczętą serię trzeba dokończyć. Dla dziewiątek działa też
            uzupełnienie parą przy dwóch kartach na stosie.
          </p>
          <p>
            <b>04 · Nie zostań ostatni</b>Pik na wierzchu oddaje ruch w lewo, pozostałe
            kolory w prawo. Gracze bez kart odpadają. Ostatnia osoba z kartami przegrywa.
          </p>
        </div>
      </section>
    {/if}

    <div class="content-layout">
      <div class="main-content">
        <div class:offscreen={view !== 'table'}><BoardElement {round} /></div>
        {#if view === 'players'}
          <section class="strategy-grid" aria-label="Strategie przeciwników">
            {#each bots as type}
              {@const strategy = strategies[type]}
              <article class="strategy-card">
                <div class="strategy-top">
                  <span class={`avatar ${strategy.color}`}>{strategy.initials}</span><span
                    class="strategy-kind"
                    >{type === PlayerType.Tactical || type === PlayerType.Rollout
                      ? 'NOWY PRZY STOLE'
                      : 'STAŁY BYWALEC'}</span
                  >
                </div>
                <h2>{strategy.name}</h2>
                <span class="method">{strategy.method}</span>
                <p>{strategy.description}</p>
                <div class="knowledge"><span>◉</span> {strategy.information}</div>
              </article>
            {/each}
          </section>
          <p class="strategy-note">
            Algorytmy są eksperymentalne. Opisy mówią, jak wybierają ruchy — nie są
            rankingiem siły gry. Symulacje mają ograniczoną liczbę kroków, a niedokończone
            partie oceniają na podstawie kart pozostałych w ręce.
          </p>
        {/if}
        <div class="below-table">
          <span
            ><span class="tiny-suit">♣</span> Bez pośpiechu. Dobra partia zaczyna się od dobrego
            ruchu.</span
          ><span>9 · 10 · J · Q · K · A</span>
        </div>
      </div>

      <aside>
        <section class="settings-panel">
          <div class="section-heading">
            <h2>Przy Twoim stole</h2>
            <span class="seat-count">{activeSeats} / 4</span>
          </div>
          <p class="panel-intro">Dobierz przeciwników do swojego stylu.</p>
          {#each selection as player, id}<PlayerSelectElement
              {id}
              {player}
              set={setPlayer}
            />{/each}
          <div class="pace">
            <label for="pace">Tempo gry</label><select
              id="pace"
              bind:value={game.thinkDelay}
              ><option value={1200}>Spokojne</option><option value={650}>Normalne</option
              ><option value={200}>Szybkie</option></select
            >
          </div>
          <div class="settings-note" class:pending={pendingChanges}>
            {activeSeats < 2
              ? 'Wybierz co najmniej dwóch graczy.'
              : pendingChanges
                ? 'Nowy skład czeka. Kliknij „Nowe rozdanie”, aby nim zagrać.'
                : 'Zmiany składu zadziałają od nowego rozdania.'}
          </div>
        </section>

        <section class="activity-panel">
          <div class="section-heading">
            <h2>Ostatnie ruchy</h2>
            <span class="activity-symbol">↗</span>
          </div>
          <div class="activity-list" aria-label="Historia ruchów">
            {#if !$game.history.length}<p class="no-moves">
                Karty rozdane. Czas na pierwszy ruch.
              </p>{/if}
            {#each $game.history.slice(-4).reverse() as entry, i}
              {@const strategy = strategies[$game.players[entry.player].type]}
              <div class="activity-row" class:latest={i === 0}>
                <span class={`activity-dot ${strategy.color}`}></span><span
                  >{strategy.name}</span
                ><strong>{entry.action}</strong>
              </div>
            {/each}
          </div>
        </section>
        <div class="table-tip">
          <span>♠</span>
          <p>
            <b>Mała karta, duża różnica.</b>Niskich figur trudniej pozbyć się pod koniec.
            Czasem warto zagrać je od razu.
          </p>
        </div>
      </aside>
    </div>
  </main>
  <footer class="app-footer">
    <span>PAN <span class="footer-suits">♠ ♥ ♣ ♦</span></span><span
      >Klasyczna gra. Nowi przeciwnicy.</span
    ><span>Stworzone dla przyjemności gry.</span>
  </footer>
</div>

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
    border-radius: 7px;
    padding: 11px 17px;
    font-size: 11px;
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
    font-size: 10px;
    padding: 9px 11px;
  }
  :global(.button.subtle) {
    background: transparent;
    border: 1px solid #8baf8544;
    color: #cadac2;
  }
  .app-shell {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 42px;
  }
  .app-header {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    border-bottom: 1px solid var(--line);
  }
  .brand {
    display: flex;
    gap: 12px;
    align-items: center;
    color: #f0eddb;
    text-decoration: none;
  }
  .brand-icon {
    width: 36px;
    height: 46px;
    display: grid;
    place-items: center;
    border: 1px solid #b9c6a7;
    border-radius: 6px;
    font:
      30px Georgia,
      serif;
    transform: rotate(-9deg);
    background: #b9c6a708;
  }
  .brand > span:last-child {
    font:
      29px Georgia,
      serif;
    letter-spacing: 5px;
  }
  .brand small {
    display: block;
    margin-top: 6px;
    font:
      7px system-ui,
      sans-serif;
    letter-spacing: 1.7px;
    color: #9eaf94;
  }
  nav {
    display: flex;
    gap: 5px;
    background: #0b15114d;
    padding: 5px;
    border: 1px solid var(--line);
    border-radius: 9px;
  }
  nav button {
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: #8f9f92;
    padding: 10px 18px;
    font-size: 11px;
    cursor: pointer;
  }
  nav button.selected {
    background: #304333;
    color: #d7e1c7;
    box-shadow: 0 1px 3px #0002;
  }
  nav button > span {
    margin-left: 5px;
    opacity: 0.65;
    font-size: 9px;
  }
  .rules-link {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5px 0;
    border: 0;
    background: transparent;
    font-size: 11px;
    color: #b0bdab;
    cursor: pointer;
  }
  .rules-link > span {
    border: 1px solid #8a9b7f;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 10px;
    display: grid;
    place-items: center;
  }
  .page-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 34px 0 27px;
  }
  .eyebrow {
    font-size: 8px;
    letter-spacing: 2px;
    font-weight: 650;
    color: #a4b594;
    margin-bottom: 10px;
  }
  h1 {
    font:
      37px/1.2 Georgia,
      'Times New Roman',
      serif;
    letter-spacing: -1px;
    margin: 0;
    color: #ececde;
    font-weight: 400;
  }
  .page-heading p {
    color: #93a38f;
    font-size: 12px;
    margin: 10px 0 0;
  }
  .shuffle-icon {
    font-size: 20px;
    line-height: 14px;
  }
  .content-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 276px;
    gap: 23px;
    align-items: start;
  }
  .main-content {
    min-width: 0;
  }
  .offscreen {
    display: none;
  }
  aside {
    display: flex;
    flex-direction: column;
    gap: 17px;
  }
  .settings-panel,
  .activity-panel {
    background: #1a2720;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 20px;
  }
  .section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h2 {
    margin: 0;
    font-size: 13px;
    font-weight: 550;
    color: #dce3d1;
  }
  .seat-count {
    color: #9dad91;
    font-size: 9px;
    border: 1px solid #aab99826;
    padding: 4px 6px;
    border-radius: 4px;
  }
  .panel-intro {
    color: #899b88;
    font-size: 10px;
    line-height: 1.6;
    margin: 7px 0 1px;
  }
  .pace {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 19px 0 14px;
  }
  .pace label {
    font-size: 10px;
    color: #a1b096;
  }
  .pace select {
    padding: 7px 8px;
    border-radius: 5px;
    background: #111d16;
    border: 1px solid #9db18c2b;
    color: #c8d4bb;
    font-size: 10px;
  }
  .settings-note {
    font-size: 9px;
    color: #8f9e88;
    line-height: 1.7;
    padding: 10px 12px;
    background: #a9c18a08;
    border-radius: 5px;
  }
  .pending {
    color: #dfc791;
    background: #dfc7910c;
  }
  .activity-panel {
    padding-block: 18px;
  }
  .activity-symbol {
    color: #99ac8a;
    font-size: 15px;
  }
  .activity-list {
    margin-top: 12px;
  }
  .activity-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    color: #94a28c;
    font-size: 10px;
  }
  .activity-row strong {
    font-weight: 500;
    color: #b4c0a7;
    margin-left: auto;
  }
  .latest {
    color: #d5dfc6;
  }
  .latest strong {
    color: #d5dfc6;
  }
  .activity-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
  .no-moves {
    font-size: 10px;
    color: #8f9e88;
    line-height: 1.8;
    margin: 15px 0 2px;
  }
  .table-tip {
    display: flex;
    gap: 12px;
    padding: 1px 9px;
  }
  .table-tip > span {
    color: #a3b18a;
    font:
      22px Georgia,
      serif;
    padding-top: 3px;
  }
  .table-tip p {
    color: #81927f;
    font-size: 10px;
    line-height: 1.8;
    margin: 0;
  }
  .table-tip b {
    display: block;
    color: #adbda1;
    font-weight: 500;
  }
  .below-table {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 18px 2px;
    font-size: 9px;
    color: #82927e;
  }
  .below-table > span:last-child {
    color: #a0ae92;
    letter-spacing: 2px;
    white-space: nowrap;
  }
  .tiny-suit {
    color: #a1b38c;
    padding-right: 4px;
  }
  .app-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    border-top: 1px solid var(--line);
    padding: 22px 0 26px;
    margin-top: 13px;
    color: #7b8c77;
    font-size: 9px;
  }
  .app-footer > span:first-child {
    color: #acb79e;
    letter-spacing: 3px;
    font:
      13px Georgia,
      serif;
  }
  .footer-suits {
    margin-left: 14px;
    color: #7f9278;
    font-size: 11px;
    letter-spacing: 6px;
  }
  .rules-panel {
    padding: 21px;
    border: 1px solid #a0b58c33;
    border-radius: 10px;
    margin-bottom: 24px;
    background: #1c2c22;
  }
  .rules-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 30px;
  }
  .rules-grid p {
    color: #a0b297;
    font-size: 11px;
    line-height: 1.8;
    margin-bottom: 0;
  }
  .rules-grid b {
    display: block;
    color: #d4dfc4;
    font-weight: 550;
    margin-bottom: 5px;
  }
  .close-button {
    background: transparent;
    border: 0;
    padding: 0 5px;
    font-size: 22px;
    color: #a9ba9b;
    cursor: pointer;
  }
  .strategy-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  .strategy-card {
    padding: 22px;
    background: linear-gradient(130deg, #25382a, #1b2a20);
    border: 1px solid #afc59726;
    border-radius: 12px;
  }
  .strategy-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .strategy-kind {
    color: #8c9e80;
    font-size: 7px;
    letter-spacing: 1px;
  }
  .strategy-card h2 {
    font:
      28px Georgia,
      serif;
    margin: 19px 0 6px;
  }
  .method {
    color: #bbcca9;
    font-size: 11px;
  }
  .strategy-card p {
    color: #9caf92;
    font-size: 11px;
    line-height: 1.9;
    margin: 15px 0;
    min-height: 63px;
  }
  .knowledge {
    border-top: 1px solid var(--line);
    padding-top: 12px;
    color: #a0b68f;
    font-size: 9px;
  }
  .knowledge > span {
    margin-right: 5px;
  }
  .strategy-note {
    font-size: 10px;
    line-height: 1.9;
    color: #8b9e81;
    margin: 18px 3px;
  }
  @media (min-width: 1400px) {
    .content-layout {
      grid-template-columns: minmax(0, 1fr) 300px;
      gap: 28px;
    }
  }
  @media (max-width: 1100px) {
    .app-shell {
      padding: 0 25px;
    }
    .content-layout {
      grid-template-columns: minmax(0, 1fr) 245px;
      gap: 18px;
    }
    .settings-panel,
    .activity-panel {
      padding: 16px;
    }
    .below-table > span:last-child {
      display: none;
    }
  }
  @media (max-width: 900px) {
    .content-layout {
      grid-template-columns: minmax(0, 1fr);
    }
    aside {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .table-tip {
      align-self: start;
    }
    .settings-panel {
      grid-row: span 2;
    }
    .app-header {
      height: 86px;
    }
    nav button {
      padding: 9px 12px;
    }
  }
  @media (max-width: 600px) {
    .app-shell {
      padding: 0 14px;
    }
    .app-header {
      height: auto;
      padding: 20px 0 16px;
      flex-wrap: wrap;
      gap: 20px 10px;
    }
    .brand > span:last-child {
      font-size: 24px;
    }
    .brand small {
      font-size: 6px;
    }
    .brand-icon {
      width: 29px;
      height: 38px;
      font-size: 25px;
    }
    nav {
      order: 3;
      width: 100%;
    }
    nav button {
      flex: 1;
      font-size: 11px;
    }
    .rules-link {
      font-size: 10px;
    }
    .page-heading {
      padding: 25px 0 22px;
      gap: 10px;
      align-items: center;
    }
    .eyebrow {
      font-size: 6px;
      letter-spacing: 1.2px;
      margin-bottom: 9px;
    }
    h1 {
      font-size: 27px;
      letter-spacing: -0.7px;
    }
    .page-heading p {
      font-size: 10px;
      max-width: 180px;
      line-height: 1.7;
      margin-top: 8px;
    }
    .page-heading .button {
      font-size: 9px;
      padding: 10px;
      white-space: nowrap;
    }
    .shuffle-icon {
      font-size: 17px;
    }
    aside {
      grid-template-columns: 1fr;
    }
    .settings-panel {
      grid-row: auto;
    }
    .table-tip {
      padding: 5px 10px 12px;
    }
    .below-table {
      font-size: 8px;
      line-height: 1.7;
    }
    .app-footer {
      flex-wrap: wrap;
      margin-top: 5px;
      font-size: 8px;
    }
    .app-footer > span:last-child {
      display: none;
    }
    .footer-suits {
      margin-left: 6px;
      letter-spacing: 3px;
    }
    .rules-grid {
      grid-template-columns: 1fr;
      gap: 4px;
    }
    .strategy-grid {
      gap: 10px;
    }
    .strategy-card {
      padding: 15px;
    }
    .strategy-card p {
      font-size: 10px;
      line-height: 1.8;
    }
    .strategy-kind {
      display: none;
    }
    .knowledge {
      font-size: 8px;
      line-height: 1.6;
    }
    .strategy-card h2 {
      font-size: 25px;
    }
    .method {
      font-size: 10px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.button) {
      transition: none;
    }
  }
</style>
