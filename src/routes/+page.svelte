<script lang="ts">
  import ALGS_CONFIG from "$lib/algs_config.json";
  import Alg from "$lib/components/Alg.svelte";
  import AlgSelector from "$lib/components/AlgSelector.svelte";
  import NiceButton from "$lib/components/NiceButton.svelte";
  import { getInitialStickers, reverseMoveString, adjustYRotation, randomAlgScramble, updateKnowledgeEasy, updateKnowledgeForgot, updateKnowledgeGood, updateKnowledgeHard } from "$lib/helpers";
  import { knowledge } from "$lib/stores";
  import { type AlgSetConfig } from "$lib/types";

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
    if (alg === "") {
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
    if (!alg || !selectedArr.length) {
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

<div class="w-full h-full flex justify-center gap-4">
  <div class="w-min flex flex-col justify-center items-center divide-y divide-black rounded-lg border border-black">
    <p class="text-lg font-bold p-2">
      {selectedArr.length} cases selected
    </p>
    <div class="flex flex-col w-full p-2">
      <div class="flex gap-2">
        <p class="font-bold">
          From set:
        </p>
        {#if selectedArr.length === 0}
          <p>
            N/A
          </p>
        {:else}
          <p>
            {set}
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
    <div class="w-full grow flex flex-col justify-center items-center gap-6 p-2">
      <div class="h-full flex items-end">
        {#if selectedArr.length}
          <p>
            {scramble}
          </p>
        {/if}
      </div>
      <Alg
        alg={reverseMoveString(scramble)}
        netStyle={(ALGS_CONFIG as AlgSetConfig)[set]?.netStyle ?? "LL"}
        initialStickers={getInitialStickers((ALGS_CONFIG as AlgSetConfig)[set]?.initialStickers)}
        hideSolution
      />
      <div class="h-full">
        {#if selectedArr.length && !showSolution}
          <button
            onclick={() => {
              showSolution = true;
            }}
            class="transition bg-gray-200 hover:bg-sky-200 active:bg-sky-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
          >
            Reveal solution (Spacebar)
          </button>
        {:else}
          <p>
            {adjustYRotation(alg, auf)}
          </p>
        {/if}
      </div>
</div>

    <div class="w-full flex gap-2 p-2">
      <NiceButton
        onclick={() => updateAndNext(1)}
        color="bg-gray-200"
        hoverColor="bg-red-200"
        activeColor="bg-red-300"
        disabled={selectedArr.length === 0}
      >
        Didn't know (1)
      </NiceButton>
      <NiceButton
        onclick={() => updateAndNext(2)}
        color="bg-gray-200"
        hoverColor="bg-amber-200"
        activeColor="bg-amber-300"
        disabled={selectedArr.length === 0}
      >
        Hard (2)
      </NiceButton>
      <NiceButton
        onclick={() => updateAndNext(3)}
        color="bg-gray-200"
        hoverColor="bg-emerald-200"
        activeColor="bg-emerald-300"
        disabled={selectedArr.length === 0}
      >
        Good (3)
      </NiceButton>
      <NiceButton
        onclick={() => updateAndNext(4)}
        color="bg-gray-200"
        hoverColor="bg-indigo-200"
        activeColor="bg-indigo-300"
        disabled={selectedArr.length === 0}
      >
        Easy (4)
      </NiceButton>
    </div>
  </div>
  <AlgSelector {selected} {setSelected} />
</div>

<svelte:window on:keydown={handleKeydown} />
