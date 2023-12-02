<script>
  import { getTorrentStatus } from '$lib/helpers/transmission';

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Torrents</h1>
  <div class="-mx-4 sm:mx-0">
    {#each data.list as { torrent, statistics }}
      <div class="px-4 py-3 sm:rounded odd:bg-secondary/10 grid grid-rows-2 grid-cols-[1fr_max-content] items-center">
        <span class="text-primary whitespace-nowrap overflow-hidden text-ellipsis">
          <a class="hover:brightness-hover" href="/torrent/{torrent.id}">{torrent.name}</a>
        </span>
        <div class="progress-radial row-span-2 text-primary ml-2" style:--value={torrent.progress}>
          <span class="text-surface-font">{torrent.progress}%</span>
        </div>
        <span class="text-xs">{getTorrentStatus(torrent, statistics)}</span>
      </div>
    {:else}
      <div class="px-4 py-3 sm:rounded bg-secondary/10">No torrents available</div>
    {/each}
  </div>
</section>

<div class="flex justify-end">
  <a class="btn btn-primary" href="/torrents/add">Add torrent</a>
</div>
