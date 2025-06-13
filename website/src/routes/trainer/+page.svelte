<script lang="ts">
  import { onMount } from "svelte";
  import ALGS_CONFIG from "$lib/algs_config.json";
  import Alg from "$lib/components/Alg.svelte";
  import AlgSelector from "$lib/components/AlgSelector.svelte";
  import { getInitialStickers, reverseMoveString, adjustYRotation, updateKnowledgeEasy, updateKnowledgeForgot, updateKnowledgeGood, updateKnowledgeHard } from "$lib/helpers";
  import { knowledge } from "$lib/stores";
  import { type AlgSetConfig, type Randomization } from "$lib/types";

  let randomAlgScramble: (alg: string, numRandom: number, randomization: Randomization) => string;
  onMount(async () => {
    try {
      ({ randomAlgScramble } = await import("$lib/cube.client.ts"));
    } catch (error) {
      console.error("error:", error);
    }
  });

  let showSolution = $state(false);
  // Tuples of alg, algset
  let selected: {
    [key: string]: [boolean, string],
  } = $state({});
  const setSelected = (x: {
    [key: string]: [boolean, string],
  }) => {
    selected = x;
  }

  // Tuples of alg, algset
  let selectedArr: [string, string][] = $derived.by(() => {
    const arr: [string, string][] = [];
    Object.keys(selected).forEach((a) => {
      if (selected[a]?.[0]) {
        arr.push([a, selected[a][1]]);
      }
    });
    return arr;
  });
  let [alg, set]: [string, string] = $derived.by(() => {
    if (selectedArr.length === 0) {
      return ["", ""];
    }
    // Sort selected algs in order by knowledge level
    const arr = [...selectedArr];
    arr.sort((a: [string, string], b: [string, string]) => {
      return ($knowledge[a[1]]?.[a[0]] ?? 0) - ($knowledge[b[1]]?.[b[0]] ?? 0);
    });
    // Choose alg to be the one with lowest knowledge level, avoiding repeats if possible
    if (arr.length > 1 && arr[0][0] === prevAlg) {
      return arr[1];
    }
    return arr[0];
  });
  let prevAlg: string = $state("");

  let [scramble, auf]: [string, string] = $derived.by(() => {
    // Ensure that we aren't doing a funny AUF if no alg is selected
    if (alg === "" || !randomAlgScramble) {
      return ["", ""];
    }
    return randomAlgScramble(alg, 2, (ALGS_CONFIG as AlgSetConfig)[set]?.randomization ?? "AUF");
  });

  const handleKeydown = (event: KeyboardEvent) => {
    // Prevent repetition when user is holding down keys
    if (event.repeat) {
      return;
    }
    if (event.key === '1') {
      updateAndNext(1);
    } else if (event.key === '2') {
      updateAndNext(2);
    } else if (event.key === '3') {
      updateAndNext(3);
    } else if (event.key === '4') {
      updateAndNext(4);
    } else if (event.key === ' ') {
      // Reveal solution on spacebar press
      showSolution = true;
    }
  }

  const updateAndNext = (difficulty: number) => {
    if (!alg) {
      return;
    }
    prevAlg = alg;
    // Make sure that there is an object for this set first
    if (!$knowledge[set]) {
      $knowledge[set] = {};
    }
    // Update knowledge level accordingly
    if (difficulty === 1) {
      $knowledge[set][alg] = updateKnowledgeForgot($knowledge[set]?.[alg] ?? 0);
    } else if (difficulty === 2) {
      $knowledge[set][alg] = updateKnowledgeHard($knowledge[set]?.[alg] ?? 0);
    } else if (difficulty === 3) {
      $knowledge[set][alg] = updateKnowledgeGood($knowledge[set]?.[alg] ?? 0);
    } else if (difficulty === 4) {
      $knowledge[set][alg] = updateKnowledgeEasy($knowledge[set]?.[alg] ?? 0);
    }
    showSolution = false;
  }
</script>

<div class="w-full h-full flex justify-center gap-12">
  <div class="grow flex flex-col justify-center items-center gap-6">

    <p class="text-lg font-bold">
      {selectedArr.length} cases selected
    </p>
    <div>
      <div class="flex gap-2">
        <p class="font-bold">
          Scramble:
        </p>
        {#if selectedArr.length === 0}
          <p>
            N/A
          </p>
        {:else}
          <p>
            {scramble}
          </p>
        {/if}
      </div>
      <div class="flex gap-2">
        <p class="font-bold">
          Knowledge level:
        </p>
        {#if selectedArr.length === 0}
          <p>
            N/A
          </p>
        {:else}
          <p>
            {$knowledge[set]?.[alg] ?? 0}/100
          </p>
        {/if}
      </div>
    </div>
    <Alg
      alg={reverseMoveString(scramble)}
      netStyle={(ALGS_CONFIG as AlgSetConfig)[set]?.netStyle ?? "LL"}
      initialStickers={getInitialStickers((ALGS_CONFIG as AlgSetConfig)[set]?.initialStickers)}
      hideSolution
    />

    <div class="flex flex-col items-center">
      {#if selectedArr.length === 0}
        <p class="italic">
          No cases selected!
        </p>
      {:else}
        <div class="h-12">
          {#if !showSolution}
            <button
              onclick={() => {
                showSolution = true;
              }}
              class="transition bg-gray-200 hover:bg-sky-200 active:bg-sky-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
            >
              Reveal solution (Spacebar)
            </button>
          {:else}
            <div class="flex gap-2">
              <p class="font-bold">
                Solution:
              </p>
              <p>
                {adjustYRotation(alg, auf)}
              </p>
            </div>
          {/if}
        </div>

        <div class="flex gap-2">
          <button
            onclick={() => updateAndNext(1)}
            class="transition bg-gray-200 hover:bg-red-200 active:bg-red-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
          >
            Didn't know (1)
          </button>
          <button
            onclick={() => updateAndNext(2)}
            class="transition bg-gray-200 hover:bg-amber-200 active:bg-amber-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
          >
            Hard (2)
          </button>
          <button
            onclick={() => updateAndNext(3)}
            class="transition bg-gray-200 hover:bg-emerald-200 active:bg-emerald-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
          >
            Good (3)
          </button>
          <button
            onclick={() => updateAndNext(4)}
            class="transition bg-gray-200 hover:bg-indigo-200 active:bg-indigo-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
          >
            Easy (4)
          </button>
        </div>
      {/if}
    </div>
  </div>
  <AlgSelector {selected} {setSelected} />
</div>

<svelte:window on:keydown={handleKeydown} />
