<script lang="ts">
  let {
    options,
    chosen = $bindable(),
  }: {
    options: string[],
    chosen: string,
  } = $props();

  // By default, choose the first option as the chosen one
  $effect(() => {
    chosen = options[0];
  });

  let open: boolean = $state(false);
  let delayedOpen: boolean = $state(false);

  $effect(() => {
    // Instantly open, but close with a delay for the transition
    if (open) {
      delayedOpen = true;
    } else {
      setTimeout(() => {
        delayedOpen = false;
      }, 150);
    }
  });
</script>

<div class="min-w-24 max-w-full whitespace-nowrap">
  <button
    onclick={() => {
      open = !open;
    }}
    class="transition w-full px-2 rounded-lg border border-black bg-white hover:bg-gray-100 active:bg-gray-200 overflow-hidden overflow-ellipsis text-left"
  >
    {chosen}
  </button>
  <div class="relative w-full">
    <div class={`transition duration-150 min-w-full max-w-60 absolute left-0 top-0 flex flex-col divide-y divide-black rounded-lg border border-black overflow-hidden ${open ? "opacity-100 translate-y-1" : "opacity-0 translate-y-0"}`}>
      {#if delayedOpen}
        {#each options as option}
          <button
            onclick={() => {
              chosen = option;
              open = false;
            }}
            class={`transition px-2 text-left overflow-hidden overflow-ellipsis ${option === chosen
              ? "bg-amber-100 hover:bg-amber-200"
              : "bg-white hover:bg-gray-100 active:bg-gray-200"}`}
          >
            {option}
          </button>
        {/each}
      {/if}
    </div>
  </div>
</div>
