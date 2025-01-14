<script lang="ts">
  import AlgButton from "$lib/components/AlgButton.svelte";
  import ALGS from "$lib/algs.json";
  import { ALGSET_NAME_MAP } from "$lib/constants";
  import type { AlgSet } from "$lib/types";
</script>

<div class="flex flex-col">
  {#each Object.entries(ALGS) as [set, algs]}
    <p class="text-2xl text-center font-bold mb-8">
      {ALGSET_NAME_MAP[set as AlgSet]} ({algs.length} cases)
    </p>
    <div class="flex justify-center flex-wrap gap-4 mb-12">
      {#each algs as alg, i}
        <AlgButton alg={alg} name={`${i + 1}.`} />
      {/each}
    </div>
  {/each}
</div>
