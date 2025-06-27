<script lang="ts">
  import CreateSubset from "./CreateSubset.svelte";
  import NiceButton from "$lib/components/NiceButton.svelte";
  import { algIsValid } from "$lib/helpers";
  import { algsets } from "$lib/stores";

  let {
    open,
    close,
    defaultName, // The values to fill in initially, in case we're editing 
    defaultInfo,
    editing,
  }: {
    open: boolean,
    close: () => void,
    defaultName: string,
    defaultInfo: [
      string,
      string[],
    ],
    editing: boolean,
  } = $props();

  let name: string = $state("");

  // Array of tuples of (subset name, algs)
  let subsets: [
    string,
    string[],
  ][] = $state([["", [""]]]);

  // Determines whether the set is valid to create
  let valid: boolean = $derived.by(() => {
    // Name cannot be empty
    if (!name) {
      return false;
    }
    const usedSubsetNames = {};
    for (let i = 0; i < subsets.length; i++) {
      let [subset, algs] = subsets[i];
      // Subset names cannot be empty or repeated
      if (!subset || usedSubsetNames[subset]) {
        return false;
      }
      for (let j = 0; j < algs.length; j++) {
        // Algs must be valid
        if (!algIsValid(algs[j])) {
          return false;
        }
      }
      usedSubsetNames[subset] = true;
    }
    return true;
  });

  // To clear info when the modal is first opened
  $effect(() => {
    if (open) {
      name = defaultName;
      subsets = defaultInfo;
    }
  });
</script>

<div class="border border-black bg-white p-8 rounded-xl flex flex-col gap-2 min-w-[24rem]">
  <h1 class="font-bold text-2xl text-center mb-2">
    {editing ? "New Algset" : "Editing Algset"}
  </h1>

  <div class="flex flex-col gap-1">
    <p class="font-bold text-sm">
      Algset Name
    </p>
    <input
      type="text"
      value={name}
      onchange={(e) => {
        name = e.target.value;
      }}
      class="p-1 rounded-lg border border-black"
      placeholder="Enter an algset name..."
    >
  </div>

  <div class="flex flex-col divide-y divide-black rounded-lg border border-black">
    <h2 class="font-bold text-xl p-1">
      Subsets
    </h2>
    {#each subsets as [subset, algs], i}
      <div class="px-2 py-3">
        <CreateSubset
          name={subset}
          setName={(x) => {
            subsets[i][0] = x;
          }}
          {algs}
          setAlgs={(x) => {
            subsets[i][1] = x;
          }}
        />
      </div>
    {/each}
    <div class="p-1">
      <NiceButton
        handleClick={() => {
          subsets = [...subsets, ["", [""]]]
        }}
        color="bg-gray-200"
        hoverColor="hover:bg-purple-200"
        activeColor="active:bg-purple-300"
        className="w-full"
      >
        Add Subset
      </NiceButton>
    </div>
  </div>

  <NiceButton
    handleClick={() => {
      // If we're editing, delete old algset
      if (editing) {
        delete $algsets[defaultName];
      }
      // Add new algset
      const subsetsObj: {
        [key: string]: string[],
      } = {};
      subsets.forEach(([subset, algs]) => {
        subsetsObj[subset] = algs;
      });
      $algsets[name] = subsetsObj;
      close();
    }}
    color="bg-green-200"
    hoverColor="hover:bg-green-300"
    activeColor="active:bg-green-400"
    className="py-2"
    disabled={!valid}
  >
    Save
  </NiceButton>
</div>
