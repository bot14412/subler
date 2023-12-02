<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<h1>Settings</h1>
<p>{data.user?.username}</p>

<form method="post" action="?/logout" use:enhance>
  <button class="btn btn-primary">Sign out</button>
</form>

<form class="flex flex-col gap-6" method="post" action="?/save" use:enhance>
  <input class="input" type="text" name="convertFolder" value={data.settings.convertFolder} />
  <button class="btn btn-primary">Save settings</button>
</form>
