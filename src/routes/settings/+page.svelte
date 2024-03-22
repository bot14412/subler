<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Settings</h1>
  {#if form?.error}
    <div class="alert alert-warning">
      <span class="icon icon-exclamation" />
      <span>{form.message}</span>
    </div>
  {/if}
  <form id="save" class="flex flex-col gap-6" method="post" action="?/save" use:enhance>
    <label class="flex items-center gap-4">
      <span class="flex-1">Download folder</span>
      <input class="input w-80" type="text" name="downloadFolder" value={data.settings.downloadFolder} />
    </label>
    <label class="flex items-center gap-4">
      <span class="flex-1">Conversion folder</span>
      <input class="input w-80" type="text" name="convertFolder" value={data.settings.convertFolder} />
    </label>
    <label class="flex items-center gap-4">
      <span class="flex-1">QuickTime compatibility</span>
      <span class="flex w-80">
        <input class="checkbox" type="checkbox" name="quicktime" checked={data.settings.quicktime} />
      </span>
    </label>
    <div class="flex items-center justify-end gap-2 sm:gap-4">
      <a class="btn btn-secondary" href="/torrents">Back</a>
      <button class="btn btn-primary" formaction="?/save">Save settings</button>
      <button class="btn btn-warning" formaction="?/logout">Sign out</button>
    </div>
  </form>
</section>
