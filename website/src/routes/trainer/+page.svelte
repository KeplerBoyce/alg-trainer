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
  let algIndex = $state(0);
  let alg = $derived(selectedArr?.[algIndex] ?? "");
</script>

<div class="w-full h-full flex justify-center gap-12">
  <div class="grow flex flex-col justify-center items-center gap-6">
    <Alg {alg} netStyle="LL" hideSolution={!showSolution} />
    <p class="">
      {randomAlgScramble(alg, 2)}
    </p>
    <button
      onclick={() => {
        showSolution = true;
      }}
      class="transition bg-gray-200 hover:bg-amber-200 active:bg-amber-300 rounded-lg px-4 py-2"
    >
      Show solution
    </button>
    <button
      onclick={() => {
        if (selectedArr.length > 0) {
          algIndex += 1;
          algIndex %= selectedArr.length;
        }
        showSolution = false;
      }}
      class="transition bg-gray-200 hover:bg-sky-200 active:bg-sky-300 rounded-lg px-4 py-2"
    >
      Next case
    </button>
  </div>
  <AlgSelector {selected} {setSelected} />
</div>