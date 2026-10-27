<script lang="ts">
  import { tr } from '../i18n'
  import { PlayerType } from '../engine/PlayerType'
  import { strategies } from '../engine/strategies'
  export let player: PlayerType
  export let id: number
  export let set: (index: number, value: PlayerType) => void

  const players = Object.values(PlayerType).filter(type =>
    id === 0 ? type !== PlayerType.None : type !== PlayerType.Human,
  )
  $: strategy = strategies[player]
</script>

<div class="seat-select">
  <span class={`avatar ${strategy.color}`}>{$tr(strategy.initials)}</span>
  <div class="select-content">
    <label for={`seat-${id}`}
      >{$tr('FOTEL')} {id + 1}{id === 0 ? $tr(' · TWÓJ') : ''}</label
    >
    <select
      id={`seat-${id}`}
      value={player}
      on:change={event => set(id, event.currentTarget.value as PlayerType)}
    >
      {#each players as type}
        <option value={type}
          >{$tr(strategies[type].name)} · {$tr(strategies[type].method)}</option
        >
      {/each}
    </select>
    <span class="information">{$tr(strategy.information)}</span>
  </div>
</div>

<style>
  .seat-select {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 17px 0;
    border-bottom: 1px solid var(--line);
  }
  .select-content {
    min-width: 0;
    flex: 1;
  }
  label {
    display: block;
    color: var(--muted);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.13em;
    margin-bottom: 5px;
  }
  select {
    width: 100%;
    padding: 3px 18px 3px 0;
    background: transparent;
    color: var(--text);
    border: 0;
    font: inherit;
    font-size: 12px;
    font-weight: 550;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .information {
    display: block;
    margin-top: 4px;
    color: var(--muted);
    font-size: 10px;
  }
</style>
