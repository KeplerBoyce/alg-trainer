<script lang="ts">
  import AlgButton from "$lib/components/AlgButton.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import AlgInfoModal from "$lib/components/modals/AlgInfoModal.svelte";
  import CreateSetModal from "$lib/components/modals/CreateSetModal.svelte";
  import Alg from "$lib/components/Alg.svelte";
  import NiceButton from "$lib/components/NiceButton.svelte";
  import Arrow from '~icons/material-symbols/keyboard-arrow-down';
  import { casesStr, allAlgsets } from "$lib/helpers";

  let modalOpen: boolean = $state(false);
  let modalAlg: string = $state();

  let createModalOpen: boolean = $state(false);

  const openAlg = (alg: string) => {
    modalOpen = true;
    modalAlg = alg;
  }

  // Set of algset names that are minimized
  let setsMinimized: {
    [key: string]: boolean,
  } = $state((() => {
    const initialMinimized: {
      [key: string]: boolean,
    } = {};
    allAlgsets().forEach(([set, _]) => {
      initialMinimized[set] = true;
    })
    return initialMinimized;
  })());
  // Set of subset names that are minimized for each subset
  let subsetsMinimized: {
    [key: string]: {
      [key: string]: boolean,
    },
  } = $state({});
</script>

<div class="flex flex-col items-center divide-y divide-black rounded-lg max-w-3xl mx-auto border border-black h-full">
  {#each allAlgsets() as [set, subsets]}
    <div class="w-full p-2">
      <button
        onclick={() => {
          if (setsMinimized[set]) {
            setsMinimized = {
              ...setsMinimized,
              [set]: false,
            };
          } else {
            setsMinimized = {
              ...setsMinimized,
              [set]: true,
            };
          }
        }}
        class="flex items-center gap-1 w-full"
      >
        <p class="text-2xl font-bold">
          {set} ({casesStr((() => {
            let count = 0;
            Object.values(subsets).forEach(subset => {
              count += subset.length;
            });
            return count;
          })())})
        </p>
        <Arrow class={`transition ${setsMinimized[set] ? "" : "rotate-180"}`} />
      </button>

      {#if !setsMinimized[set]}
        <div class="flex flex-col divide-y divide-black w-full mt-2 rounded-lg border border-black">
          {#each Object.entries(subsets) as [subset, algs]}
            <div class="p-2">
              <button
                onclick={() => {
                  if (subsetsMinimized[set]?.[subset]) {
                    subsetsMinimized = {
                      ...subsetsMinimized,
                      [set]: {
                        ...subsetsMinimized[set],
                        [subset]: false,
                      }
                    };
                  } else {
                    subsetsMinimized = {
                      ...subsetsMinimized,
                      [set]: {
                        ...subsetsMinimized[set],
                        [subset]: true,
                      }
                    };
                  }
                }}
                class="flex items-center gap-1"
              >
                <p class="text-xl font-bold">
                  {subset} ({casesStr(algs.length)})
                </p>
                <Arrow class={`transition ${subsetsMinimized[set]?.[subset] ? "" : "rotate-180"}`} />
              </button>

              {#if !subsetsMinimized[set]?.[subset]}
                <div class="w-full flex flex-wrap">
                  {#each algs as alg, i}
                    <AlgButton {alg} name={`${i + 1}.`} callback={() => openAlg(alg)} />
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}

  <div class="w-full p-2">
    <NiceButton
      handleClick={() => {createModalOpen = true}}
      color="bg-teal-200"
      hoverColor="hover:bg-teal-300"
      activeColor="active:bg-teal-400"
      className="px-3 py-2"
    >
      Create New Algset
    </NiceButton>
  </div>
</div>

<Modal open={modalOpen} close={() => {modalOpen = false}}>
  <AlgInfoModal alg={modalAlg} />
</Modal>

<Modal open={createModalOpen} close={() => {createModalOpen = false}}>
  <CreateSetModal />
</Modal>
