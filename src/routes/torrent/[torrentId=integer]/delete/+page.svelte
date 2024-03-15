<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Delete Torrent</h1>

  {#if form?.error}
    <div class="alert alert-warning">
      <span class="icon icon-exclamation" />
      <span>{form.message}</span>
    </div>
  {/if}

  <div class="flex flex-col">
    <span>Do you really want to delete this torrent?</span>
    <span>All data will be lost except converted files.</span>
  </div>
</section>

<form class="flex justify-end gap-4" method="post" use:enhance>
  <a class="btn btn-secondary" href="/torrent/{data.torrent.id}">Cancel</a>
  <button class="btn btn-warning">Delete</button>
</form>
