<script>
  import { enhance } from '$app/forms';
  import { getStreamDetails } from '$lib/helpers/ffmpeg';

  /** @type {import("./$types").PageData} */
  export let data;

  /** @type {import("./$types").ActionData}*/
  export let form;

  let checked = data.streams.map(() => true);

  /** @type {import('./$types').Snapshot<Array<boolean>>} */
  export const snapshot = {
    capture: () => {
      return checked;
    },
    restore: (value) => {
      checked = value;
    },
  };
</script>

<form method="POST" use:enhance>
  <section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
    <h1>Streams</h1>
    {#if form?.error}
      <div class="alert alert-error">
        <span class="icon icon-exclamation" />
        <span>{form.message}</span>
      </div>
    {/if}
    {#if data.convertionWarning}
      <div class="alert alert-warning">
        <span class="icon icon-exclamation" />
        <span>Starting a new convertion will overwrite existing files.</span>
      </div>
    {/if}
    <div class="-mx-4 sm:mx-0">
      {#each data.streams as stream, index}
        {@const details = getStreamDetails(stream)}
        <div class="px-4 py-3 sm:rounded odd:bg-secondary/10 flex items-center gap-3">
          <input class="checkbox" type="checkbox" name="mapping" value={index} bind:checked={checked[index]} />
          <div class="flex flex-col flex-1 justify-center h-12">
            {#if stream.type === 'subtitle'}
              <a href="/torrent/{data.torrent.id}/preview/{index}">{details}</a>
            {:else}
              <span>{details}</span>
            {/if}
            {#if stream.name}
              <span>name: {stream.name}</span>
            {/if}
          </div>
        </div>
      {:else}
        <div class="px-4 py-3 sm:rounded bg-secondary/10">Cannot convert this torrent</div>
      {/each}
    </div>
  </section>
  <div class="mt-8 flex justify-end gap-4">
    <a class="btn btn-secondary" href="/torrent/{data.torrent.id}">Back</a>
    <button class="btn btn-primary" disabled={data.disableConvertion}>Convert</button>
  </div>
</form>
