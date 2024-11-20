<script>
  /** @type {import('./$types').PageData} */
  export let data;

  /** @param {string} file */
  function basename(file) {
    const index = file.lastIndexOf('/');
    return file.substring(index + 1);
  }
</script>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Media Files</h1>
  <div class="-mx-4 sm:mx-0">
    {#each data.mediaFiles as media}
      <div class="px-4 py-3 sm:rounded odd:bg-secondary/10 flex items-center gap-2">
        <span class="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{basename(media.file)}</span>
        {#if media.status === 'finished'}
          <span class="icon icon-check w-4 h-4 text-primary"></span>
        {:else if media.status === 'error'}
          <span class="icon icon-exclamation w-4 h-4 text-warning"></span>
        {:else if media.progress !== undefined}
          <div class="progress text-primary w-16 sm:w-24" style:--value={media.progress}></div>
        {/if}
      </div>
    {:else}
      <div class="px-4 py-3 sm:rounded bg-secondary/10">Not available</div>
    {/each}
  </div>
</section>

<div class="flex items-center justify-end gap-2 sm:gap-4">
  <a class="btn btn-secondary" href="/torrents">Back</a>
  <a class="btn btn-primary" href="/torrent/{data.torrent.id}/statistics">Stats</a>
  {#if data.disableConvertion}
    <button class="btn btn-primary" disabled>Convert</button>
  {:else}
    <a class="btn btn-primary" href="/torrent/{data.torrent.id}/convert">Convert</a>
  {/if}
  <a class="btn btn-warning" href="/torrent/{data.torrent.id}/delete">Delete</a>
</div>
