<script lang="ts">
  import AlgButton from "$lib/components/AlgButton.svelte";
  import ALGS from "$lib/algs.json";
  import Modal from "$lib/components/Modal.svelte";
  import Alg from "$lib/components/Alg.svelte";
  import { casesStr } from "$lib/helpers";

  let modalOpen = false;
  let modalAlg: string;

  const openAlg = (alg: string) => {
    modalOpen = true;
    modalAlg = alg;
  }
</script>

<div class="flex flex-col">
  {#each Object.entries(ALGS) as [set, subsets]}

    <p class="text-2xl text-center font-bold mb-8">
      {set} ({casesStr((() => {
        let count = 0;
        Object.values(subsets).forEach(subset => {
          count += subset.length;
        });
        return count;
      })())})
    </p>

    {#each Object.entries(subsets) as [subset, algs]}
      <p class="text-2xl text-center font-bold mb-8">
        {subset} ({casesStr(algs.length)})
      </p>

      <div class="flex justify-center flex-wrap gap-4 mb-12">
        {#each algs as alg, i}
          <AlgButton {alg} name={`${i + 1}.`} callback={() => openAlg(alg)} />
        {/each}
      </div>
    {/each}
  {/each}
</div>

<Modal open={modalOpen} close={() => {modalOpen = false}}>
  <div class="bg-white p-8 rounded-xl flex flex-col gap-8">
    {#if modalAlg}
      <Alg alg={modalAlg} netStyle="LL" />
    {/if}
  </div>
</Modal>
