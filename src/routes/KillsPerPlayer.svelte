<section>
  <h1>Kills per player</h1> 
  <ul>
    {#each Object.entries(kills) as [player, kill]}
      <li>{player}: {kill}</li>
    {/each}
  </ul>
</section>

<style>
  section {
    background-color: #ffd54f;
    border-radius: 4px;
    padding: 8px;
  }
  h1, ul {
    margin: 0;
  }
  h1 {
    margin-bottom: 12px;
  }
</style>

<script>
  /** @type {Object<string, number>} */
  export let kills;
</script>