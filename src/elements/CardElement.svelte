<script lang="ts">
  import { tr } from '../i18n'
  import type { Card } from '../engine/Card'

  export let card: Card
  export let hidden = false
  export let possible: (card: Card) => boolean = () => false
  export let click: (card: Card) => void = () => {}
  export let compact = false
</script>

<button
  type="button"
  class="card"
  class:back={hidden}
  class:playable={!hidden && possible(card)}
  class:red={card.colorStyle === 'red'}
  class:compact
  disabled={hidden || !possible(card)}
  aria-label={hidden
    ? $tr('Zakryta karta')
    : `${card.text}${possible(card) ? $tr(' — zagraj') : ''}`}
  on:click={() => click(card)}
>
  {#if hidden}
    <span class="back-pattern"><span>♠</span></span>
  {:else}
    <span class="corner"><b>{card.figureText}</b><span>{card.colorText}</span></span>
    <span class="suit" aria-hidden="true">{card.colorText}</span>
    <span class="corner bottom" aria-hidden="true"
      ><b>{card.figureText}</b><span>{card.colorText}</span></span
    >
  {/if}
</button>

<style>
  .card {
    position: relative;
    display: block;
    width: 76px;
    height: 108px;
    padding: 8px;
    flex-shrink: 0;
    border: 1px solid #d9d9cd;
    border-radius: 8px;
    background: linear-gradient(140deg, #fffef8, #efeee5);
    color: #26322f;
    box-shadow:
      0 3px 5px #0003,
      inset 0 0 0 3px #fff5;
    font-family: Georgia, 'Times New Roman', serif;
    opacity: 1;
    transition:
      transform 160ms,
      box-shadow 160ms;
  }
  .red {
    color: #be494b;
  }
  .corner {
    position: absolute;
    top: 6px;
    left: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 15px;
    line-height: 17px;
  }
  .corner b {
    font-size: 18px;
    font-weight: 600;
  }
  .bottom {
    inset: auto 7px 6px auto;
    transform: rotate(180deg);
  }
  .suit {
    display: grid;
    place-items: center;
    height: 100%;
    font-size: 42px;
  }
  .playable {
    cursor: pointer;
    border-color: #b9e7c9;
    box-shadow:
      0 0 0 2px #b2e3c657,
      0 5px 12px #0003;
  }
  .playable:hover,
  .playable:focus-visible {
    transform: translateY(-12px);
    box-shadow:
      0 0 0 2px #bceace,
      0 12px 22px #0004;
    outline: none;
  }
  .back {
    padding: 5px;
    background: #d2d5c9;
    border-color: #9cafa5;
  }
  .back-pattern {
    display: grid;
    place-items: center;
    height: 100%;
    border-radius: 4px;
    border: 1px solid #a4bdac;
    background-color: #294c45;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 5px,
        #b0d8bd14 5px,
        #b0d8bd14 6px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 5px,
        #b0d8bd14 5px,
        #b0d8bd14 6px
      );
  }
  .back-pattern > span {
    display: grid;
    place-items: center;
    width: 28px;
    height: 35px;
    border: 1px solid #a2b98d99;
    border-radius: 50%;
    color: #d5d6ae;
    font-size: 22px;
    background: #294c45;
  }
  .compact {
    width: 45px;
    height: 65px;
    padding: 4px;
    border-radius: 5px;
  }
  .compact .corner {
    top: 3px;
    left: 4px;
    font-size: 10px;
    line-height: 11px;
  }
  .compact .corner b {
    font-size: 12px;
  }
  .compact .bottom {
    inset: auto 4px 3px auto;
  }
  .compact .suit {
    font-size: 24px;
  }
  .compact .back-pattern > span {
    width: 21px;
    height: 27px;
    font-size: 18px;
  }
  @media (max-width: 600px) {
    .card {
      width: 62px;
      height: 90px;
    }
    .compact {
      width: 37px;
      height: 54px;
    }
    .suit {
      font-size: 32px;
    }
    .corner b {
      font-size: 16px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }
  }
</style>
