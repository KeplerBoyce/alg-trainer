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

<div class="flex flex-col mt-4">
  {#each Object.entries(ALGS) as [set, subsets]}
    <div class="mb-8">
      <h2 class="text-2xl text-center font-bold mb-4">
        {set} ({casesStr((() => {
          let count = 0;
          Object.values(subsets).forEach(subset => {
            count += subset.length;
          });
          return count;
        })())})
      </h2>

      {#each Object.entries(subsets) as [subset, algs]}
        <h3 class="text-xl text-center font-bold mb-2">
          {subset} ({casesStr(algs.length)})
        </h3>

        <div class="flex justify-center flex-wrap mb-4">
          {#each algs as alg, i}
            <AlgButton {alg} name={`${i + 1}.`} callback={() => openAlg(alg)} />
          {/each}
        </div>
      {/each}
    </div>
  {/each}
</div>

<Modal open={modalOpen} close={() => {modalOpen = false}}>
  <div class="bg-white p-8 rounded-xl flex flex-col gap-8">
    {#if modalAlg}
      <Alg alg={modalAlg} netStyle="LL" />
    {/if}
  </div>
</Modal>
