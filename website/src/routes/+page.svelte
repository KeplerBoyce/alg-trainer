<script lang="ts">
  import AlgButton from "$lib/components/AlgButton.svelte";
  import ALGS from "$lib/algs.json";
  import { ALGSET_NAME_MAP } from "$lib/constants";
  import { type AlgSet, type AlgWithDupes } from "$lib/types";
  import Modal from "$lib/components/Modal.svelte";
  import AlgMirrorGroup from "$lib/components/AlgMirrorGroup.svelte";

  let modalOpen = false;
  let modalAlg: AlgWithDupes;

  const openAlg = (alg: AlgWithDupes) => {
    modalOpen = true;
    modalAlg = alg;
  }
</script>

<div class="flex flex-col">
  {#each Object.entries(ALGS) as [set, algs]}
    <p class="text-2xl text-center font-bold mb-8">
      {ALGSET_NAME_MAP[set as AlgSet]} ({algs.length} cases)
    </p>
    <div class="flex justify-center flex-wrap gap-4 mb-12">
      {#each algs as alg, i}
        <AlgButton alg={alg} name={`${i + 1}.`} callback={() => openAlg(alg)} />
      {/each}
    </div>
  {/each}
</div>

<Modal open={modalOpen} close={() => {modalOpen = false}}>
  <div class="bg-white p-8 rounded-xl flex flex-col gap-8">
    {#if modalAlg}
      <AlgMirrorGroup algs={modalAlg.normal} name="Normal case" />
      <AlgMirrorGroup algs={modalAlg.mirrorM} name="Mirrored across M case" />
      <AlgMirrorGroup algs={modalAlg.mirrorS} name="Mirrored across S case" />
      <AlgMirrorGroup algs={modalAlg.mirrorBoth} name="Mirrored across both M and S case" />
    {/if}
  </div>
</Modal>
