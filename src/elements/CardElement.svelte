<script lang="ts">
  import { Card } from '../engine/card'

  export let card: Card
</script>

<div style={`color: ${card.colorStyle}`} on:click>
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

  div:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transform: translateY(-20px);
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
