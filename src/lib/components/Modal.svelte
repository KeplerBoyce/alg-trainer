<script lang="ts">
  import AkarIconsCross from '~icons/akar-icons/cross'

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

<div
  class={`fixed inset-0 flex justify-center bg-black/30 items-center transition duration-300
    ${open ? "opacity-100" : "opacity-0"}
    ${internalOpen ? "z-[100]" : "-z-10"}`}
  on:click={() => {
    if (open) {
      close();
    }
  }}
>
  <div
    class={`z-[110] relative transition duration-300 ${open ? "translate-y-0 scale-100" : "translate-y-2 scale-90"}`}
    on:click|stopPropagation={() => {}}
  >
    <slot />
    <div
      role="button"
      on:click={close}
      class="absolute top-2 right-2"
    >
      <div class="hover:bg-slate-100 active:bg-slate-200 p-2 rounded-full">
        <AkarIconsCross />
      </div>
    </div>
  </div>
</div>
