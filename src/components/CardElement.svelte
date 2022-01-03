<script lang="ts">
  import { store } from '../store/store'
  import { Card } from '../engine/card'

  const { game } = store

  export let card: Card
  export let disabled: boolean
</script>

<div
  style={`color: ${card.colorStyle}`}
  on:click={() => game.action(card)}
  class={disabled ? 'disabled' : ''}
>
  <header>{card.toString()}</header>
  <main>{card.toString()}</main>
  <footer>{card.toString()}</footer>
</div>

<style>
  div {
    border: 1px solid black;
    border-radius: 10px;
    padding: 5px;
    width: 70px;
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    row-gap: 20px;
  }

  div.disabled {
    opacity: 0.5;
    background-color: lightgray;
  }

  main {
    font-size: 2em;
    text-align: center;
  }

  header,
  footer {
    text-align: left;
  }

  footer {
    transform: rotate(180deg);
  }

  :global(button) {
    border: 1px solid black;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
    background-color: white;
  }
  :global(button:disabled) {
    background-color: lightgray;
  }
</style>
