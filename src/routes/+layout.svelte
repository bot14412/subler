<script>
  import { navigating } from '$app/stores';
  import { page } from '$app/stores';
  import '$lib/styles/index.css';
</script>

{#if $navigating}
  <div class="fixed inset-0 z-20 bg-black/10 inline-grid place-content-center">
    <span class="px-6 py-4 border border-surface-font/25 bg-surface shadow rounded">Loading...</span>
  </div>
{/if}

<nav class="sticky top-0 z-10 w-full backdrop-blur bg-surface/60 border-b border-surface-font/10">
  <div class="h-16 px-4 md:px-8 flex flex-row items-center justify-between">
    <ul class="flex gap-4 items-center">
      <li>
        <svg class="h-5 fill-current" viewBox="0 0 200 162">
          <path
            d="m62 98c-2 8 0 14 1 18a68 68 0 0037 40 75 75 0 0060 0 62 62 0 0037-40 59 59 0 00-7-49 64 64 0 00-15-17l-62-48c-4-3-11-3-16 0-4 4-5 9-1 12l26 21-79 0c-7 0-13 5-14 10-2 6 3 10 10 10l40 0-72 55c-7 6-9 14-5 20 5 5 14 5 21 0l39-32zm100 21c-8 8-20 13-32 13-12 0-23-5-32-13a36 36 0 01-6-43 45 45 0 0138-21 45 45 0 0128 10 36 36 0 0114 25 38 38 0 01-10 29zm-58-28a24 24 0 019-17 28 28 0 0118-6 29 29 0 0118 6 24 24 0 019 17c0 7-3 13-7 18a28 28 0 01-20 8c-8 0-15-3-20-8a23 23 0 01-7-18z"
          />
        </svg>
      </li>
      <li class="text-lg"><a href="/">Sub<span class="font-light">ler</span></a></li>
    </ul>
    <ul class="flex gap-3">
      {#if $page.data.user}
        <li><a href="/torrents">Torrents</a></li>
        <li><a href="/settings">Settings</a></li>
      {:else}
        <li><a href="/login">Sign in</a></li>
      {/if}
    </ul>
  </div>
</nav>

<main class="max-w-4xl mx-auto flex flex-col gap-8 px-4 md:px-8 py-8">
  <slot />
</main>
