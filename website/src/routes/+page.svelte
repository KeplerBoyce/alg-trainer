<script lang="ts">
  import Alg from "$lib/components/Alg.svelte";
  import LSE_ALGS from "$lib/lse_algs.json";
  import LSE_SETS from "$lib/lse_order.json";
  import LSE_DUPE from "$lib/lse_dupe_choice.json";
</script>

<div class="flex flex-col">
  {#each LSE_SETS as set}
    <p class="text-2xl text-center font-bold mb-8">
      {set.name} ({set.list.length} cases)
    </p>
    <div class="flex justify-center flex-wrap gap-12 mb-12">
      {#each set.list as x}
        <Alg alg={LSE_ALGS[x][LSE_DUPE[x]]} name={`${x}.`} />
      {/each}
    </div>
  {/each}
</div>
