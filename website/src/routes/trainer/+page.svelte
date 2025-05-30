<script lang="ts">
  import Alg from "$lib/components/Alg.svelte";
  import AlgSelector from "$lib/components/AlgSelector.svelte";
  import { randomAlgScramble } from "$lib/helpers";

  let showSolution = $state(false);
  let selected: {
    [key: string]: boolean,
  } = $state({});
  const setSelected = (x: {
    [key: string]: boolean,
  }) => {
    const currAlg = alg;
    selected = x;
    if (!currAlg || !selected[currAlg]) {
      algIndex = 0;
      showSolution = false;
    } else {
      algIndex = selectedArr.indexOf(currAlg);
    }
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
  let algIndex = $state(0);
  let alg = $derived(selectedArr?.[algIndex] ?? "");

  const handleKeydown = (event: KeyboardEvent) => {
    // Prevent repetition when user is holding down keys
    if (event.repeat) {
      return;
    }
    if (event.key === ' ') {
      // Go to next case on spacebar
      algIndex += 1;
      algIndex %= selectedArr.length;
      showSolution = false;
      event.preventDefault();
    } else if (event.key === 'Backspace') {
      // Reveal solution on backspace
      showSolution = true;
    }
  }
</script>

<div class="w-full h-full flex justify-center gap-12">
  <div class="grow flex flex-col justify-center items-center gap-6">

    <p class="text-lg font-bold">
      {selectedArr.length} cases selected
    </p>
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
              class="transition bg-gray-200 hover:bg-amber-200 active:bg-amber-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
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

        <button
          onclick={() => {
            if (selectedArr.length > 0) {
              algIndex += 1;
              algIndex %= selectedArr.length;
            }
            showSolution = false;
          }}
          class="transition bg-gray-200 hover:bg-sky-200 active:bg-sky-300 rounded-lg px-4 py-2 w-min whitespace-nowrap"
        >
          Next case (Space)
        </button>
      {/if}
    </div>
  </div>
  <AlgSelector {selected} {setSelected} />
</div>

<svelte:window on:keydown={handleKeydown} />
