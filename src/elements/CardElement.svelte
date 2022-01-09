<script lang="ts">
  import { Card } from '../engine/Card'

  export let card: Card
  export let hidden = false
  export let possible: (card: Card) => boolean = () => true
  export let click: (card: Card) => void
</script>

<div
  style={`color: ${card.colorStyle}`}
  on:click={() => {
    if (possible(card)) {
      click(card)
    }
  }}
  class={hidden ? 'hidden' : possible(card) ? 'active' : 'no-active'}
>
  <header>
    <span>
      {card.figureText}
    </span>
    <span />
    <span>
      {card.colorText}
    </span>
  </header>
  <main>{card.text}</main>
  <footer>
    <span>
      {card.figureText}
    </span>
    <span />
    <span>
      {card.colorText}
    </span>
  </footer>
</div>

<style>
  div {
    user-select: none;
    border: 1px solid black;
    border-radius: 10px;
    padding: 5px;
    width: 75px;
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    gap: 10px;
    background-color: white;
    position: relative;
    transition: transform 0.2s ease-in-out;
  }

  .active:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .active {
    transform: translateY(-20px);
  }

  .no-active {
    background-color: rgb(247, 243, 211);
  }

  .hidden {
    background-color: rgb(67, 67, 194);
    color: rgb(67, 67, 194) !important;
  }

  main {
    font-size: 40px;
    text-align: center;
  }

  header,
  footer {
    display: grid;
    grid-template-rows: 15px 15px;
    grid-template-columns: 20px 1fr;
  }

  span {
    text-align: center;
  }

  footer {
    transform: rotate(180deg);
  }
</style>
