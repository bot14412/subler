<script>
  let items = [
    { name: 'The.Witcher.S03.MULTi.HDR.DV.1080p.WEB.AD.DPP5.1.Atmos.H265-TFA', status: 'Downloading', progress: 25 },
    { name: 'Another short title 2', status: 'Downloading', progress: 50 },
    { name: 'Testulle 3', status: 'Seeding', progress: 75 },
  ];
</script>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Buttons</h1>
  <div class="flex flex-wrap gap-4">
    <button class="btn btn-primary" type="button">Primary</button>
    <button class="btn btn-secondary" type="button">Secondary</button>
    <button class="btn btn-tertiary" type="button">Tertiary</button>
  </div>
  <div class="flex flex-wrap gap-4">
    <button class="btn btn-success" type="button">Success</button>
    <button class="btn btn-success" type="button" disabled>Success disabled</button>
  </div>
  <div class="flex flex-wrap gap-4">
    <button class="btn btn-warning" type="button">Error</button>
    <button class="btn btn-icon btn-warning" type="button">
      <span class="icon icon-trash" />
      <span>Error with icon</span>
    </button>
  </div>
</section>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Forms</h1>
  <div class="alert alert-warning">
    <span class="icon icon-exclamation" />
    <span>Warning message</span>
  </div>
  <div class="alert alert-success">
    <span class="icon icon-check" />
    <span>Success message</span>
  </div>
  <form class="flex flex-col gap-6">
    <input class="input" type="email" placeholder="Email address" />
    <input class="input" type="password" placeholder="Password" />
    <label class="flex items-center gap-4">
      <input class="checkbox" type="checkbox" checked />
      <span>Remember me</span>
    </label>
    <div>
      <label class="flex items-center gap-4">
        <input class="checkbox" type="checkbox" checked />
        <span>Remember me inside</span>
      </label>
    </div>
    <select class="select" required>
      <option value>Select your next city...</option>
      <option>Noisy-le-Sec</option>
      <option>Villemomble</option>
      <option>Tremblay-en-France</option>
    </select>
  </form>
</section>

<section class="section flex flex-col gap-8 px-4 md:px-8 py-8">
  <h1>Progress meters</h1>
  <div class="progress text-primary" style:--value={0} />
  <div class="progress text-warning" style:--value={20} />
  <div class="progress text-success" style:--value={25} />
  <div class="progress" style:--value={100} />
  <div class="flex gap-4">
    <div class="progress-radial" style:--value={90}>90%</div>
    <div class="progress-radial text-primary" style:--value={95}>95%</div>
    <div class="progress-radial text-warning" style:--value={25}>25%</div>
    <div class="progress-radial text-success" style:--value={90}>90%</div>
  </div>
</section>

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

<p>
  Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin
  literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College
  in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through
  the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections
  1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC.
  This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum,
  "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
</p>
