<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Stream Preview</h1>

  <div class="-mx-4 sm:mx-0">
    {#each data.preview as subtitle}
      <div class="px-4 py-3 sm:rounded odd:bg-secondary/10">
        <p class="font-medium mb-2">{subtitle.timestamp}</p>
        <pre class="text-sm whitespace-pre-line">{subtitle.content.join('\n')}</pre>
      </div>
    {:else}
      <div class="px-4 py-3 sm:rounded bg-secondary/10">Not available</div>
    {/each}
  </div>
</section>

<div class="flex gap-4 justify-end">
  <a class="btn btn-secondary" href="/torrent/{data.torrent.id}/convert">Back</a>
</div>
