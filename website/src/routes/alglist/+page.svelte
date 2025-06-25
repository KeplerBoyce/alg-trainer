<script lang="ts">
  import AlgButton from "$lib/components/AlgButton.svelte";
  import ALGS from "$lib/algs.json";
  import Modal from "$lib/components/Modal.svelte";
  import Alg from "$lib/components/Alg.svelte";
  import Arrow from '~icons/material-symbols/keyboard-arrow-down';
  import { casesStr } from "$lib/helpers";

  let modalOpen: boolean = $state(false);
  let modalAlg: string = $state();

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
    Object.entries(ALGS).forEach(([set, _]) => {
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

<div class="flex flex-col items-center mt-4">
  {#each Object.entries(ALGS) as [set, subsets]}
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
      class="flex items-center gap-1 mb-4"
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
      {#each Object.entries(subsets) as [subset, algs]}
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
          class="flex items-center gap-1 mb-2"
        >
          <p class="text-xl font-bold">
            {subset} ({casesStr(algs.length)})
          </p>
          <Arrow class={`transition ${subsetsMinimized[set]?.[subset] ? "" : "rotate-180"}`} />
        </button>

        {#if !subsetsMinimized[set]?.[subset]}
          <div class="flex justify-center flex-wrap mb-4">
            {#each algs as alg, i}
              <AlgButton {alg} name={`${i + 1}.`} callback={() => openAlg(alg)} />
            {/each}
          </div>
        {/if}
      {/each}
    {/if}
  {/each}
</div>

<Modal open={modalOpen} close={() => {modalOpen = false}}>
  <div class="bg-white p-8 rounded-xl flex flex-col gap-8">
    {#if modalAlg}
      <Alg alg={modalAlg} netStyle="LL" />
    {/if}
  </div>
</Modal>
