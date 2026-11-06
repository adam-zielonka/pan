<script lang="ts">
  import { PlayerType } from '../engine/PlayerType'
  import { strategies } from '../engine/strategies'

  export let type: PlayerType
</script>

<span class={`avatar ${strategies[type].color}`} aria-hidden="true">
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    focusable="false"
  >
    {#if type === PlayerType.Human}
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    {:else if type === PlayerType.None}
      <path
        d="M6 13V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8M4 11v6h16v-6M6 17v4m12-4v4M4 13h16"
      />
    {:else if type === PlayerType.Random}
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <g fill="currentColor" stroke="none">
        <circle cx="7.5" cy="7.5" r="1.3" />
        <circle cx="16.5" cy="7.5" r="1.3" />
        <circle cx="12" cy="12" r="1.3" />
        <circle cx="7.5" cy="16.5" r="1.3" />
        <circle cx="16.5" cy="16.5" r="1.3" />
      </g>
    {:else if type === PlayerType.Simple}
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <path d="M12 6v12m-4-4 4 4 4-4" />
    {:else if type === PlayerType.MCTS}
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M12 8v5M5 16v-3h14v3" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="16" y="16" width="6" height="6" rx="1" />
    {:else if type === PlayerType.AZ}
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    {:else if type === PlayerType.Tactical}
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    {:else if type === PlayerType.Rollout}
      <path d="M20 9a8 8 0 0 0-14-3L3 9m0-6v6h6M4 15a8 8 0 0 0 14 3l3-3m-6 0h6v6" />
    {/if}
  </svg>
</span>

<style>
  .avatar {
    width: 39px;
    height: 41px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    border: 1px solid #ffffff0d;
    border-radius: 11px;
  }
  svg {
    width: 70%;
    height: 70%;
    max-width: 24px;
    max-height: 24px;
  }
</style>
