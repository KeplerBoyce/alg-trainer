<script lang="ts">
  import ALGS from "$lib/algs.json";
  import { casesStr } from "$lib/helpers";
  import Alg from "./Alg.svelte";
  import Arrow from '~icons/material-symbols/keyboard-arrow-down';

  let {
    selected,
    setSelected,
  }: {
    selected: {
      [key: string]: boolean,
    },
    setSelected: (x: {
      [key: string]: boolean,
    }) => void,
  } = $props();

  // Set of algset names that are minimized
  let setsMinimized: {
    [key: string]: boolean,
  } = $state({});
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
          console.log(a);
          if (!selected[a]) {
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
          console.log(a);
          if (!selected[a]) {
            allSelected = false;
            return;
          }
        });
        map[set][subset] = allSelected;
      });
    });
    return map;
  });
</script>

<div class="flex flex-col w-1/3 max-w-2xl">
  {#each Object.entries(ALGS) as [set, subsets]}
    <div class="flex mb-2 items-center gap-4">
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
        class="flex items-center gap-1"
      >
        <p class="text-lg font-bold">
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
      <button
        onclick={() => {
          // If all are selected, deselect all, otherwise select all
          if (allSelected[set]) {
            Object.values(subsets).forEach(subset => {
              subset.forEach(a => {
                selected[a] = false;
              });
            });
            selected = {...selected};
          } else {
            Object.values(subsets).forEach(subset => {
              subset.forEach(a => {
                selected[a] = true;
              });
            });
            selected = {...selected};
          }
        }}
        class={`transition px-2 py-1 rounded-lg ${allSelected[set]
          ? "bg-purple-200 hover:bg-purple-300 active:bg-purple-400"
          : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}
        `}
      >
        {allSelected[set] ? "Deselect All" : "Select All"}
      </button>
    </div>

    {#if !setsMinimized[set]}
      {#each Object.entries(subsets) as [subset, algs]}
        <div class="flex mb-2 items-center gap-4 pl-4">
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
            <p class="font-bold">
              {subset} ({casesStr(algs.length)})
            </p>
            <Arrow class={`transition ${subsetsMinimized[set]?.[subset] ? "" : "rotate-180"}`} />
          </button>
          <button
            onclick={() => {
              // If all are selected, deselect all, otherwise select all
              if (subsetsAllSelected[set][subset]) {
                Object.values(subsets).forEach(subset => {
                  subset.forEach(a => {
                    selected[a] = false;
                  });
                });
                selected = {...selected};
              } else {
                Object.values(subsets).forEach(subset => {
                  subset.forEach(a => {
                    selected[a] = true;
                  });
                });
                selected = {...selected};
              }
            }}
            class={`transition px-2 py-1 rounded-lg ${subsetsAllSelected[set][subset]
              ? "bg-purple-200 hover:bg-purple-300 active:bg-purple-400"
              : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}
            `}
          >
            {allSelected[set] ? "Deselect All" : "Select All"}
          </button>
        </div>

        {#if !subsetsMinimized[set]?.[subset]}
          <div class="flex flex-wrap">
            {#each algs as a}
              <button
                onclick={() => {
                  if (selected[a]) {
                    setSelected({
                      ...selected,
                      [a]: false,
                    });
                  } else {
                    setSelected({
                      ...selected,
                      [a]: true,
                    });
                  }
                }}
                class={`${selected[a] ? "bg-green-200" : ""} w-min p-2`}
              >
                <Alg alg={a} netStyle="LL" hideSolution small />
              </button>
            {/each}
          </div>
        {/if}
      {/each}
    {/if}
  {/each}
</div>