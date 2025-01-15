<script lang="ts">
  import { type Algorithm } from "$lib/types";
  import Alg from "./Alg.svelte";

  export let algs: Algorithm[];
  export let name: string;
</script>

{#if algs && algs.length > 0}
  <div>
    <h2 class="font-bold text-2xl mb-4">
      {name}
    </h2>
    <div class="flex gap-8">
      {#each algs as alg}
        <Alg alg={alg} />
      {/each}
    </div>
  </div>
{/if}
