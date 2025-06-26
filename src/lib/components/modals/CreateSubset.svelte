<script lang="ts">
  import NiceButton from "$lib/components/NiceButton.svelte";

  let {
    name,
    setName,
    algs,
    setAlgs,
  }: {
    name: string,
    setName: (x: string) => void,
    algs: string[],
    setAlgs: (x: string[]) => void,
  } = $props();
</script>

<div class="w-full flex flex-col gap-1 p-1">
  <p class="font-bold text-sm">
    Subset Name
  </p>
  <input
    type="text"
    onchange={(e) => {
      setName(e.target.value);
    }}
    class="p-1 rounded-lg border border-black"
    placeholder="Enter a name..."
  >

  <p class="font-bold text-sm mt-2">
    Algorithms
  </p>
  {#each algs as alg, i}
    <input
      type="text"
      onchange={(e) => {
        const newAlgs = [...algs];
        newAlgs[i] = e.target.value;
        setAlgs = newAlgs;
      }}
      class="px-1 rounded-lg border border-black"
      placeholder="e.g. F R U R' U' F'"
    >
  {/each}
  <NiceButton
    handleClick={() => {
      setAlgs([...algs, ""]);
    }}
    color="bg-gray-200"
    hoverColor="hover:bg-amber-200"
    activeColor="active:bg-amber-300"
  >
    Add Alg
  </NiceButton>
</div>
