<script>
  /** @type {import("./$types").PageData} */
  export let data;
</script>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Statistics</h1>

  <div class="-mx-4 sm:mx-0">
    {#each data.statistics as stat}
      <div class="px-4 py-3 sm:rounded odd:bg-secondary/10 flex items-center gap-3">
        <pre>{new Date(stat.timestamp).toLocaleString()} - {stat.progress}%</pre>
      </div>
    {:else}
      <div class="px-4 py-3 sm:rounded bg-secondary/10">No statistics available</div>
    {/each}
  </div>
</section>

<div class="flex gap-4 justify-end">
  <a class="btn btn-secondary" href="/torrent/{data.torrent.id}">Back</a>
</div>
