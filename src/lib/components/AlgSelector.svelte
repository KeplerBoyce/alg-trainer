<script lang="ts">
  import { casesStr, allAlgsets } from "$lib/helpers";
  import { knowledge, algsets, configs } from "$lib/stores";
  import { type AlgSetConfig } from "$lib/types";
  import { STICKERS_OBJECT_MAP } from "$lib/constants";
  import Alg from "./Alg.svelte";
  import Arrow from '~icons/material-symbols/keyboard-arrow-down';

  let {
    selected,
    setSelected,
  }: {
    selected: {
      [key: string]: {
        [key: string]: {
          [key: string]: [boolean, string],
        },
      },
    },
    setSelected: (x: {
      [key: string]: {
        [key: string]: {
          [key: string]: [boolean, string],
        },
      },
    }) => void,
  } = $props();

  // A derived store here just to force reactivity
  let allSets = $derived(allAlgsets($algsets, $configs));

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

  // Set of algset names that are fully selected
  let allSelected: {
    [key: string]: boolean,
  } = $derived.by(() => {
    let map: {
      [key: string]: boolean,
    } = {};
    allSets.forEach(([set, subsets]) => {
      let allSelected = true;
      Object.values(subsets).forEach(subset => {
        subset.forEach(a => {
          if (!selected[set]?.[subset]?.[a]) {
            allSelected = false;
            return;
          }
        });
        if (!allSelected) {
          return;
        }
      });
      map[set] = allSelected;
    });
    return map;
  });

  // Set of subsets that are fully selected in each algset
  let subsetsAllSelected: {
    [key: string]: {
      [key: string]: boolean,
    },
  } = $derived.by(() => {
    let map: {
      [key: string]: {
        [key: string]: boolean,
      },
    } = {};
    allSets.forEach(([set, subsets]) => {
      map[set] = {};
      Object.entries(subsets).forEach(([subset, algs]) => {
        let allSelected = true;
        algs.forEach(a => {
          if (!selected[set]?.[subset]?.[a]) {
            allSelected = false;
            return;
          }
        });
        map[set][subset] = allSelected;
      });
    });
    return map;
  });

  const setAvgKnowledgeLevel = (set: string) => {
    let subsets = [];
    // Find the proper subset by name
    for (let i = 0; i < allSets.length; i++) {
      if (allSets[i][0] === set) {
        subsets = Object.values(allSets[i][1]);
      }
    }
    // Find total knowledge level
    let totalKnowledge = 0;
    let numAlgs = 0;
    subsets.forEach(subset => {
      subset.forEach(alg => {
        numAlgs += 1;
        totalKnowledge += $knowledge[set]?.[alg] ?? 0;
      });
    });
    return (totalKnowledge / numAlgs).toFixed(1);
  }
</script>

<div class="flex flex-col w-1/3 min-w-min max-w-[38rem] divide-y divide-black overflow-y-scroll border border-black rounded-lg">
  {#each allSets as [set, subsets, defaultSet, config]}
    <div>
      <div class="flex items-center">
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
          class="grow flex items-center gap-1 whitespace-nowrap hover:bg-gray-100 p-2 rounded-lg"
        >
          <div class="flex items-end gap-1">
            <p class="text-lg font-bold text-left">
              {set}
            </p>
            <p class="text-sm font-bold italic p-1">
              ({casesStr((() => {
                let count = 0;
                Object.values(subsets).forEach(subset => {
                  count += subset.length;
                });
                return count;
              })())})
            </p>
          </div>
          <Arrow class={`transition ${setsMinimized[set] ? "" : "rotate-180"}`} />
          <p class="grow italic whitespace-nowrap text-left">
            {`${setAvgKnowledgeLevel(set)}% learned`}
          </p>
        </button>
        <button
          onclick={() => {
            // If all are selected, deselect all, otherwise select all
            const newSelected = {...selected};
            Object.values(subsets).forEach(subset => {
              subset.forEach(a => {
                newSelected[set][subset][a] = !allSelected[set];
              });
            });
            setSelected(newSelected);
          }}
          class={`w-24 m-1 border border-black whitespace-nowrap transition px-2 py-1 rounded-lg ${allSelected[set]
            ? "bg-purple-200 hover:bg-purple-300 active:bg-purple-400"
            : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}
          `}
        >
          {allSelected[set] ? "Deselect" : "Select All"}
        </button>
      </div>
      {#if !setsMinimized[set]}
        <div class="mx-2 mb-2 flex flex-col divide-y divide-black rounded-lg border border-black">
          {#each Object.entries(subsets) as [subset, algs]}
            <div>
              <div class="flex items-center">
                <button
                  onclick={() => {
                    // Invert minimized value
                    subsetsMinimized = {
                      ...subsetsMinimized,
                      [set]: {
                        ...subsetsMinimized[set],
                        [subset]: !subsetsMinimized[set]?.[subset],
                      }
                    };
                  }}
                  class="h-full flex items-center gap-1 grow hover:bg-gray-100 p-2 rounded-lg"
                >
                  <p class="font-bold text-left">
                    {subset} ({casesStr(algs.length)})
                  </p>
                  <Arrow class={`transition ${subsetsMinimized[set]?.[subset] ? "" : "rotate-180"}`} />
                </button>
                <button
                  onclick={() => {
                    // If all are selected, deselect all, otherwise select all
                    const newSelected = {...selected};
                    algs.forEach(a => {
                      newSelected[set][subset][a] = !subsetsAllSelected[set][subset];
                    });
                    setSelected(newSelected);
                  }}
                  class={`w-24 m-1 border border-black whitespace-nowrap transition px-2 py-1 rounded-lg ${subsetsAllSelected[set][subset]
                    ? "bg-purple-200 hover:bg-purple-300 active:bg-purple-400"
                    : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}
                  `}
                >
                  {subsetsAllSelected[set][subset] ? "Deselect All" : "Select All"}
                </button>
              </div>

              {#if !subsetsMinimized[set]?.[subset]}
                <div class="flex flex-wrap">
                  {#each algs as a}
                    <button
                      onclick={() => {
                        const newSelected = {...selected};
                        if (!(set in newSelected)) {
                          newSelected[set] = {};
                        }
                        if (!(subset in newSelected[set])) {
                          newSelected[set][subset] = {};
                        }
                        newSelected[set][subset][a] = !selected[set]?.[subset]?.[a];
                        setSelected(newSelected);
                      }}
                      class={`${selected[set]?.[subset]?.[a] ? "bg-green-200" : ""} w-min p-2`}
                    >
                      <Alg
                        alg={a}
                        netStyle="LL"
                        hideSolution
                        small
                        initialStickers={STICKERS_OBJECT_MAP[config.initialStickers]}
                      />
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>
