<script lang="ts">
  import { PlayerType } from '../store/PlayersStore'

  export let player: PlayerType
  export let id: number
  export let set: (index: number, value: PlayerType) => void

  const isHuman = !id
  const players = Object.values(PlayerType).filter(
    playerType => playerType !== (isHuman ? PlayerType.None : PlayerType.Human),
  )

  function castPlayerType(value: string): PlayerType {
    return value as PlayerType
  }
</script>

<div>
  <select
    value={player}
    on:change={event => {
      set(id, castPlayerType(event.currentTarget.value))
    }}
  >
    {#each players as p}
      <option value={p}>#{id + 1} {p}</option>
    {/each}
  </select>
</div>
