<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<form method="post" use:enhance>
  <section class="section shadow w-full max-w-xl mx-auto mt-8 flex flex-col gap-8 px-4 md:px-8 py-8">
    <h1>Sign in to Subler</h1>
    <div class="flex flex-col gap-4">
      {#if form?.error}
        <div class="alert alert-warning">
          <span class="icon icon-exclamation" />
          <span>{form.message}</span>
        </div>
      {/if}
      <input class="input" name="email" type="email" placeholder="Email" required />
      <input class="input" name="password" type="password" placeholder="Password" required />
    </div>
    <button class="btn btn-tertiary">Sign in</button>
  </section>
</form>
