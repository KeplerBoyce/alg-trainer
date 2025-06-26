<script lang="ts">
  import CreateSubset from "./CreateSubset.svelte";
  import NiceButton from "$lib/components/NiceButton.svelte";
  import { algsets } from "$lib/stores";

  let name: string = $state("");
  let subsets: {
    [key: string]: string[],
  } = $state({"": [""]});

  const setName = (x: string) => {
    name = x;
  }

  const setAlgs = (subset: string, x: string[]) => {
    subsets[subset] = x;
  }
</script>

<div class="border border-black bg-white p-8 rounded-xl flex flex-col gap-2 min-w-[24rem]">
  <h1 class="font-bold text-2xl text-center mb-2">
    New Algset
  </h1>

  <div class="flex flex-col divide-y divide-black rounded-lg border border-black">
    <h2 class="font-bold text-xl p-1">
      Subsets
    </h2>
    {#each Object.entries(subsets) as [subset, algs]}
      <CreateSubset {name} {setName} {algs} setAlgs={(x) => setAlgs(subset, x)} />
    {/each}
  </div>

  <NiceButton
    handleClick={() => {
      $algsets[name] = subsets;
    }}
    color="bg-green-200"
    hoverColor="hover:bg-green-300"
    activeColor="active:bg-green-400"
    className="py-2"
  >
    Save
  </NiceButton>
</div>
