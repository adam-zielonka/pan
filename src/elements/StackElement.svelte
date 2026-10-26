<script lang="ts">
  import { store } from '../engine/Store'
  import CardElement from './CardElement.svelte'
  const { game } = store
</script>

<div class="pile" aria-label={`Stos: ${$game.stack.length} kart`}>
  {#if !$game.stack.length}
    <div class="empty">
      <span>9<span class="heart">♥</span></span><small>Tu zaczyna się gra</small>
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
  {$game.stack.length ? `${$game.stack.length} kart na stole` : 'Czekamy na 9♥'}
</div>

<style>
  .pile {
    height: 128px;
    width: 160px;
    position: relative;
    margin: 0 auto;
  }
  .pile-card {
    position: absolute;
    left: calc(42px + (var(--i) - (var(--total) - 1) / 2) * 24px);
    top: calc(7px + var(--i) * 2px);
    transform: rotate(calc((var(--i) - (var(--total) - 1) / 2) * 10deg));
  }
  .empty {
    height: 108px;
    width: 76px;
    border: 1px dashed #9dbeac66;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
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
  small {
    font-size: 8px;
    text-align: center;
    color: #94b3a4;
  }
  .pile-label {
    color: #a3bfb0;
    text-align: center;
    font-size: 11px;
    letter-spacing: 0.03em;
    margin-top: 5px;
  }
  @media (max-width: 600px) {
    .pile {
      height: 108px;
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
