<script lang="ts">
  import { store } from '../store/store'
  import { Card } from '../engine/card'

  const { game } = store

  export let card: Card
  export let disabled: boolean
</script>

<button style={`color: ${card.colorStyle}`} {disabled} on:click={() => game.action(card)}>
  {card.toString()}
</button>

<style>
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
