<script>
  let items = [
    { name: 'The.Witcher.S03.MULTi.HDR.DV.1080p.WEB.AD.DPP5.1.Atmos.H265-TFA', status: 'Downloading', progress: 25 },
    { name: 'Another short title 2', status: 'Downloading', progress: 50 },
    { name: 'Testulle 3', status: 'Seeding', progress: 75 },
  ];
</script>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Grid</h1>
  <div class="-mx-4 sm:mx-0">
    {#each items as item}
      <div class="px-4 py-3 sm:rounded odd:bg-secondary/10 grid grid-rows-2 grid-cols-[1fr_max-content]">
        <span class="text-primary whitespace-nowrap overflow-hidden text-ellipsis">
          <a class="hover:brightness-hover" href="/storybook/table">{item.name}</a>
        </span>
        <div class="progress-radial row-span-2" style:--value={item.progress}>
          <span class="text-surface-font">{item.progress}%</span>
        </div>
        <span class="text-sm">Informations about this torrent</span>
      </div>
    {/each}
  </div>
</section>
