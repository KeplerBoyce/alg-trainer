<script lang="ts">
  import Alg from "$lib/components/Alg.svelte";
  import AlgSelector from "$lib/components/AlgSelector.svelte";
  import { randomAlgScramble, updateKnowledgeEasy, updateKnowledgeForgot, updateKnowledgeGood, updateKnowledgeHard } from "$lib/helpers";
  import { knowledge } from "$lib/stores";

  let showSolution = $state(false);
  let selected: {
    [key: string]: boolean,
  } = $state({});
  const setSelected = (x: {
    [key: string]: boolean,
  }) => {
    selected = x;
  }

  let selectedArr: string[] = $derived.by(() => {
    const arr: string[] = [];
    Object.keys(selected).forEach((a) => {
      if (selected[a]) {
        arr.push(a);
      }
    });
    return arr;
  });
  let alg: string = $derived.by(() => {
    if (selectedArr.length === 0) {
      return "";
    }
    // Sort selected algs in order by knowledge level
    const arr = [...selectedArr];
    arr.sort((a: string, b: string) => {
      return ($knowledge[a] ?? 0) - ($knowledge[b] ?? 0);
    });
    // Choose alg to be the one with lowest knowledge level, avoiding repeats if possible
    if (arr.length > 1 && arr[0] === prevAlg) {
      return arr[1];
    }
    return arr[0];
  });
  let prevAlg: string = $state("");

  const handleKeydown = (event: KeyboardEvent) => {
    // Prevent repetition when user is holding down keys
    if (event.repeat) {
      return;
    }
    if (event.key === ' ') {
      // Go to next case on spacebar
      showSolution = false;
      event.preventDefault();
    } else if (event.key === 'Backspace') {
      // Reveal solution on backspace
      showSolution = true;
    }
  }

  const updateAndNext = (difficulty: number) => {
    const currAlg = alg;
    prevAlg = currAlg;
    if (difficulty === 1) {
      $knowledge[currAlg] = updateKnowledgeForgot($knowledge[currAlg] ?? 0);
    } else if (difficulty === 2) {
      $knowledge[currAlg] = updateKnowledgeHard($knowledge[currAlg] ?? 0);
    } else if (difficulty === 3) {
      $knowledge[currAlg] = updateKnowledgeGood($knowledge[currAlg] ?? 0);
    } else if (difficulty === 4) {
      $knowledge[currAlg] = updateKnowledgeEasy($knowledge[currAlg] ?? 0);
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
            {randomAlgScramble(alg, 2)}
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
            {$knowledge[alg] ?? 0}/100
          </p>
        {/if}
      </div>
    </div>
    <Alg {alg} netStyle="LL" hideSolution />

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
              Reveal solution (Backspace)
            </button>
          {:else}
            <div class="flex gap-2">
              <p class="font-bold">
                Solution:
              </p>
              <p>
                {alg}
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
            class="transition bg-gray-200 hover:bg-red-200 active:bg-red-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
          >
            Hard (2)
          </button>
          <button
            onclick={() => updateAndNext(3)}
            class="transition bg-gray-200 hover:bg-amber-200 active:bg-amber-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
          >
            Good (3)
          </button>
          <button
            onclick={() => updateAndNext(4)}
            class="transition bg-gray-200 hover:bg-emerald-200 active:bg-emerald-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
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
