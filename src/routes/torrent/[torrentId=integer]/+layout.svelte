<script>
  import { getFullTorrentStatus } from '$lib/helpers/transmission';

  /** @type {import("./$types").LayoutData} */
  export let data;
</script>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1 class="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{data.torrent.name}</h1>
  <div>
    {#each getFullTorrentStatus(data.torrent, data.statistics) as part}
      <p>{part.label}: {part.value}</p>
    {/each}
  </div>
</section>

<slot />
