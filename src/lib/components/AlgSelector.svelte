<script lang="ts">
  import ALGS from "$lib/algs.json";
  import ALGS_CONFIG from "$lib/algs_config.json";
  import { casesStr, getInitialStickers } from "$lib/helpers";
  import { knowledge } from "$lib/stores";
  import { type AlgSetConfig } from "$lib/types";
  import Alg from "./Alg.svelte";
  import Arrow from '~icons/material-symbols/keyboard-arrow-down';

  let {
    selected,
    setSelected,
  }: {
    selected: {
      [key: string]: [boolean, string],
    },
    setSelected: (x: {
      [key: string]: [boolean, string],
    }) => void,
  } = $props();

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

  // Set of algset names that are fully selected
  let allSelected: {
    [key: string]: boolean,
  } = $derived.by(() => {
    let map: {
      [key: string]: boolean,
    } = {};
    Object.entries(ALGS).forEach(([set, subsets]) => {
      let allSelected = true;
      Object.values(subsets).forEach(subset => {
        subset.forEach(a => {
          if (!selected[a]?.[0]) {
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
    Object.entries(ALGS).forEach(([set, subsets]) => {
      map[set] = {};
      Object.entries(subsets).forEach(([subset, algs]) => {
        let allSelected = true;
        algs.forEach(a => {
          if (!selected[a]?.[0]) {
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
    let totalKnowledge = 0;
    let numAlgs = 0;
    Object.values(ALGS[set]).forEach(subset => {
      subset.forEach(alg => {
        numAlgs += 1;
        totalKnowledge += $knowledge[set]?.[alg] ?? 0;
      });
    });
    
    return (totalKnowledge / numAlgs).toFixed(2);
  }
</script>

<div class="flex flex-col w-1/3 min-w-min max-w-[38rem] divide-y divide-black overflow-y-scroll border border-black rounded-lg">
  {#each Object.entries(ALGS) as [set, subsets]}
    <div class="p-2">
      <div class="flex items-center gap-4">
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
          class="flex items-center gap-1 grow whitespace-nowrap"
        >
          <p class="text-lg font-bold text-left">
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
        <p class="italic whitespace-nowrap">
          {`${setAvgKnowledgeLevel(set)}% learned`}
        </p>
        <button
          onclick={() => {
            // If all are selected, deselect all, otherwise select all
            if (allSelected[set]) {
              const newSelected = {...selected};
              Object.values(subsets).forEach(subset => {
                subset.forEach(a => {
                  newSelected[a] = [false, set];
                });
              });
              setSelected(newSelected);
            } else {
              const newSelected = {...selected};
              Object.values(subsets).forEach(subset => {
                subset.forEach(a => {
                  newSelected[a] = [true, set];
                });
              });
              setSelected(newSelected);
            }
          }}
          class={`whitespace-nowrap transition px-2 py-1 rounded-lg ${allSelected[set]
            ? "bg-purple-200 hover:bg-purple-300 active:bg-purple-400"
            : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}
          `}
        >
          {allSelected[set] ? "Deselect All" : "Select All"}
        </button>
      </div>
      {#if !setsMinimized[set]}
        <div class="mt-2 flex flex-col divide-y divide-black rounded-lg border border-black">
          {#each Object.entries(subsets) as [subset, algs]}
            <div class="p-1">
              <div class="flex items-center gap-4 pl-1">
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
                  class="flex items-center gap-1 grow"
                >
                  <p class="font-bold text-left">
                    {subset} ({casesStr(algs.length)})
                  </p>
                  <Arrow class={`transition ${subsetsMinimized[set]?.[subset] ? "" : "rotate-180"}`} />
                </button>
                <button
                  onclick={() => {
                    // If all are selected, deselect all, otherwise select all
                    if (subsetsAllSelected[set][subset]) {
                      const newSelected = {...selected};
                      algs.forEach(a => {
                        newSelected[a] = [false, set];
                      });
                      setSelected(newSelected);
                    } else {
                      const newSelected = {...selected};
                      algs.forEach(a => {
                        newSelected[a] = [true, set];
                      });
                      setSelected(newSelected);
                    }
                  }}
                  class={`whitespace-nowrap transition px-2 py-1 rounded-lg ${subsetsAllSelected[set][subset]
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
                        if (selected[a]?.[0]) {
                          setSelected({
                            ...selected,
                            [a]: [false, set],
                          });
                        } else {
                          setSelected({
                            ...selected,
                            [a]: [true, set],
                          });
                        }
                      }}
                      class={`${selected[a]?.[0] ? "bg-green-200" : ""} w-min p-2`}
                    >
                      <Alg
                        alg={a}
                        netStyle="LL"
                        hideSolution
                        small
                        initialStickers={getInitialStickers((ALGS_CONFIG as AlgSetConfig)[set]?.initialStickers)}
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
