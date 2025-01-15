<script lang="ts">
  export let open: boolean;
  export let close: () => void;

  let internalOpen = false;

  $: if (open) {
    internalOpen = true;
  }

  $: if (!open) {
    setTimeout(() => {
      internalOpen = false;
    }, 300)
  }
</script>

<button on:click={close} class="hover:cursor-default">
  <div
    class={`fixed inset-0 flex justify-center bg-black/50 items-center transition duration-300
      ${open ? "opacity-100" : "opacity-0"}
      ${internalOpen ? "z-[100]" : "-z-10"}`}
  >
    <div class={`transition duration-300 ${open ? "translate-y-0 scale-100" : "translate-y-2 scale-90"}`}>
      <slot />
    </div>
  </div>
</button>
