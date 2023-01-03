<formfield>
  <select bind:value={selected}>
    {#each options as option}
      <option value={option}>{option.text}</option>
    {/each}
  </select>
  <button on:click={getStatistics}>Get {selected.text}</button>
</formfield>

<div class="content">
  {#if content !== null}
    {#if content.matchScore}
      <MatchScore score={content.matchScore} />
    {/if}
    {#if content.roundAverageLength}
      <RoundAverage round={content.roundAverageLength} />
    {/if}
    {#if content.killsPerPlayer}
      <KillsPerPlayer kills={content.killsPerPlayer} />
    {/if}
  {/if}
</div>

<style>
  formfield {
    display: inline-block;
    margin-bottom: 16px;
  }
  .content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  button {
    outline: none;
    padding: 4px 8px;
    background-color: #66bb6a;
    border-radius: 4px;
    border: 1px solid #388e3c;
  }
  button:hover {
    cursor: pointer;
    background-color: #388e3c;
  }
</style>

<script>
  import KillsPerPlayer from './KillsPerPlayer.svelte';
  import MatchScore from './MatchScore.svelte';
  import RoundAverage from './RoundAverage.svelte';

  const options = [
    { id: 0, text: 'All Statistics', value: '' },
    { id: 1, text: 'Average Score', value: 'score' },
    { id: 2, text: 'Round Average Time', value: 'round_average' },
    { id: 3, text: 'Kills Per Player', value: 'kills' }
  ];

  let selected = options[0];

  /**
   * @typedef {Object} Content
   * @property {string} matchScore
   * @property {string} roundAverageLength
   * @property {Object<string, number>} killsPerPlayer
  */

  /**
   * @type {null | Content}
   */
  let content = null;

  async function getStatistics() {
    const response = await fetch(`http://localhost:3000/statistics/${selected.value}`);
    content = await response.json();
  }

</script>