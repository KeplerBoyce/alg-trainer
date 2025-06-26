<script lang="ts">
  import Alg from "$lib/components/Alg.svelte";

  let {
    alg,
  }: {
    alg: string,
  } = $props();
</script>

<div class="border border-black bg-white p-8 rounded-xl flex flex-col gap-8">
  {#if alg}
    <Alg {alg} netStyle="LL" />
  {/if}
</div>
