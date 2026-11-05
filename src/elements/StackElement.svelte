<script lang="ts">
  import { tr } from '../i18n'
  import { store } from '../engine/Store'
  import CardElement from './CardElement.svelte'
  const { game } = store
</script>

<div class="pile" aria-label={$tr('Stos: {count} kart', { count: $game.stack.length })}>
  {#if !$game.stack.length}
    <div class="empty">
      <span>9<span class="heart">♥</span></span>
    </div>
  {:else}
    {#each $game.stack.slice(-3) as card, i (card.text)}
      <div
        class="pile-card"
        style={`--i: ${i}; --total: ${Math.min($game.stack.length, 3)}`}
      >
        <CardElement {card} />
      </div>
    {/each}
  {/if}
</div>
<div class="pile-label">
  {$game.stack.length
    ? $tr('{count} kart na stole', { count: $game.stack.length })
    : $tr('Czekamy na 9♥')}
</div>

<style>
  .pile {
    height: 124px;
    width: 156px;
    position: relative;
    margin: 0 auto;
  }
  .pile-card {
    position: absolute;
    left: calc(40px + (var(--i) - (var(--total) - 1) / 2) * 22px);
    top: calc(6px + var(--i) * 2px);
    transform: rotate(calc((var(--i) - (var(--total) - 1) / 2) * 8deg));
  }
  .empty {
    height: 108px;
    width: 76px;
    border: 1px dashed #9dbeac66;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 7px auto 0;
  }
  .empty > span {
    font:
      28px Georgia,
      serif;
    color: #adc4b7;
  }
  .heart {
    color: #d69389;
  }
  .pile-label {
    color: #c1d4c4;
    text-align: center;
    font-size: 13px;
    line-height: 18px;
    letter-spacing: 0.03em;
    margin-top: 2px;
  }
  @media (max-width: 600px) {
    .pile {
      height: 106px;
      width: 140px;
    }
    .pile-card {
      left: calc(39px + (var(--i) - (var(--total) - 1) / 2) * 17px);
    }
    .empty {
      width: 62px;
      height: 90px;
    }
  }
</style>
