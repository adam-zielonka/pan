<script lang="ts">
  import { Card } from '../engine/card'

  export let card: Card
</script>

<span style={`color: ${card.colorStyle}`}>
  {card.toString()}
</span>
