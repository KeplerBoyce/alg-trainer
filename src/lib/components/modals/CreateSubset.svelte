<script lang="ts">
  import NiceButton from "$lib/components/NiceButton.svelte";

  let {
    name,
    setName,
    algs,
    setAlgs,
    canDelete,
    deleteSubset,
  }: {
    name: string,
    setName: (x: string) => void,
    algs: string[],
    setAlgs: (x: string[]) => void,
    canDelete: boolean,
    deleteSubset: () => void,
  } = $props();
</script>

<div class="w-full flex flex-col gap-1 p-1">
  <div class="flex items-end">
    <p class="grow font-bold text-sm">
      Subset Name
    </p>
    <NiceButton
      handleClick={() => {
        deleteSubset();
      }}
      className="px-1.5 py-1 text-white font-bold text-sm"
      color="bg-red-500"
      hoverColor="hover:bg-red-600"
      activeColor="active:bg-red-700"
      disabled={!canDelete}
    >
      Delete Subset
    </NiceButton>
  </div>
  <input
    type="text"
    value={name}
    oninput={(e) => {
      setName(e.target.value);
    }}
    class="p-1 rounded-lg border border-black"
    placeholder="Enter a subset name..."
  >

  <p class="font-bold text-sm mt-2">
    Algorithms
  </p>
  {#each algs as alg, i}
    <div class="w-full flex gap-1">
      <input
        type="text"
        value={alg}
        oninput={(e) => {
          const newAlgs = [...algs];
          newAlgs[i] = e.target.value;
          setAlgs(newAlgs);
        }}
        class="min-w-0 grow px-1 rounded-lg border border-black"
        placeholder="e.g. F R U R' U' F'"
      >
      <NiceButton
        handleClick={() => {
          const newAlgs = [...algs];
          newAlgs.splice(i, 1);
          setAlgs(newAlgs);
        }}
        className="px-1.5 text-white font-bold text-xs"
        color="bg-red-500"
        hoverColor="hover:bg-red-600"
        activeColor="active:bg-red-700"
        disabled={algs.length === 1}
      >
        Delete
      </NiceButton>
    </div>
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
