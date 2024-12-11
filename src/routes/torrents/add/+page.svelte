<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<form method="post" enctype="multipart/form-data" use:enhance>
  <section class="bg-surface-accent rounded flex flex-col gap-8 px-4 md:px-8 py-8">
    <h1>New Torrent</h1>
    {#if form?.error}
      <div class="alert alert-warning">
        <span class="icon icon-exclamation"></span>
        <span>{form.message}</span>
      </div>
    {/if}
    <div class="flex flex-col gap-4">
      <span>Please select a torrent file:</span>
      <input class="file" type="file" name="file" />
    </div>
    <div class="flex flex-col gap-4">
      <span>Or enter a magnet URL:</span>
      <input class="input" type="text" name="magnet" />
    </div>
  </section>
  <div class="mt-8 flex gap-4 justify-end">
    <a class="btn btn-secondary" href="/torrents">Cancel</a>
    <button class="btn btn-primary">Add</button>
  </div>
</form>
