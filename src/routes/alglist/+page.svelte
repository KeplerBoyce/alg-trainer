<script lang="ts">
  import AlgButton from "$lib/components/AlgButton.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import AlgInfoModal from "$lib/components/modals/AlgInfoModal.svelte";
  import CreateSetModal from "$lib/components/modals/CreateSetModal.svelte";
  import Alg from "$lib/components/Alg.svelte";
  import NiceButton from "$lib/components/NiceButton.svelte";
  import Arrow from '~icons/material-symbols/keyboard-arrow-down';
  import { casesStr, allAlgsets } from "$lib/helpers";
  import { algsets } from "$lib/stores";

  // A derived store here just to force reactivity
  let allSets = $derived(allAlgsets($algsets));

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
    allSets.forEach(([set, _]) => {
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

  // Default info to fill in create set modal
  let defaultName: string = $state("");
  let defaultInfo: [
    string,
    string[],
  ] = $state(["", [""]]);
  // True when an existing set is being edited
  let editingSet: boolean = $state(false);

  const editAlgset = (algset: string) => {
    const info = [];
    Object.entries($algsets[algset]).forEach(([subset, algs]) => {
      info.push([subset, algs]);
    });
    console.log(info)
    defaultInfo = info;
    defaultName = algset;
    editingSet = true;
    createModalOpen = true;
  }

  const deleteAlgset = (algset: string) => {
    delete $algsets[algset];
    $algsets = {...$algsets};
  }
</script>

<div class="flex flex-col items-center divide-y divide-black rounded-lg max-w-3xl mx-auto border border-black h-full">
  {#each allSets as [set, subsets, defaultSet]}
    <div class="w-full p-2">
      <div class="w-full flex">
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
        
        <NiceButton
          handleClick={() => {
            let newName = set;
            // Set of algset names that are already in use
            const usedNames = {};
            allSets.forEach(([name]) => {
              usedNames[name] = true;
            });
            // Keep adding asterisks until the name isn't used (can't have duplicate names)
            while (usedNames[newName]) {
              newName += '*';
            }
            setsMinimized[newName] = true;
            $algsets[newName] = subsets;
          }}
          className="px-2 text-sm font-bold text-white mr-1"
          color="bg-orange-400"
          hoverColor="hover:bg-orange-500"
          activeColor="active:bg-orange-600"
        >
          Copy
        </NiceButton>
        <NiceButton
          handleClick={() => {
            editAlgset(set);
          }}
          className="px-2 text-sm font-bold text-white mr-1"
          color="bg-sky-400"
          hoverColor="hover:bg-sky-500"
          activeColor="active:bg-sky-600"
          disabled={defaultSet}
        >
          Edit
        </NiceButton>
        <NiceButton
          handleClick={() => {
            deleteAlgset(set);
          }}
          className="px-2 text-sm font-bold text-white"
          color="bg-red-500"
          hoverColor="hover:bg-red-600"
          activeColor="active:bg-red-700"
          disabled={defaultSet}
        >
          Delete
        </NiceButton>
      </div>

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
      handleClick={() => {
        defaultInfo = ["", [""]];
        editingSet = false;
        createModalOpen = true;
      }}
      color="bg-teal-200"
      hoverColor="hover:bg-teal-300"
      activeColor="active:bg-teal-400"
      className="w-full px-3 py-2 font-bold"
    >
      Create New Algset
    </NiceButton>
  </div>
</div>

<Modal open={modalOpen} close={() => {modalOpen = false}}>
  <AlgInfoModal alg={modalAlg} />
</Modal>

<Modal open={createModalOpen} close={() => {createModalOpen = false}}>
  <CreateSetModal
    open={createModalOpen}
    close={() => {createModalOpen = false}}
    {defaultName}
    {defaultInfo}
    editing={editingSet}
  />
</Modal>
