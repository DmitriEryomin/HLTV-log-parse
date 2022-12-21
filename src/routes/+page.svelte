<select bind:value={selected}>
  {#each options as option}
    <option value={option}>{option.text}</option>
  {/each}
</select>
<button on:click={getStatistics}>Get {selected.text}</button>

<div class="content">
  {#if content !== null}
    {#if content.matchScore}
      <MatchScore />
    {/if}
    {#if content.roundAverageLength}
      <RoundAverage />
    {/if}
    {#if content.killsPerPlayer}
      <KillsPerPlayer />
    {/if}
  {/if}
</div>

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