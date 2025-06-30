<script lang="ts">
  import CreateSubset from "./CreateSubset.svelte";
  import NiceButton from "$lib/components/NiceButton.svelte";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import { type AlgSetConfig } from "$lib/types";
  import { NET_STYLE_MAP, RANDOMIZATION_MAP, INITIAL_STICKERS_MAP } from "$lib/constants";
  import { algIsValid, reverseObject } from "$lib/helpers";
  import { algsets, configs } from "$lib/stores";

  let {
    open,
    close,
    defaultName, // The values to fill in initially, in case we're editing 
    defaultInfo,
    defaultConfig,
    editing,
  }: {
    open: boolean,
    close: () => void,
    defaultName: string,
    defaultInfo: [
      string,
      string[],
    ],
    defaultConfig: AlgSetConfig,
    editing: boolean,
  } = $props();

  let name: string = $state("");

  // Array of tuples of (subset name, algs)
  let subsets: [
    string,
    string[],
  ][] = $state([["", [""]]]);

  // Net style, randomization, and sticker style choices
  let netStyle: string = $state("");
  let randomization: string = $state("");
  let stickers: string = $state("");

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
      netStyle = NET_STYLE_MAP[defaultConfig.netStyle];
      randomization = RANDOMIZATION_MAP[defaultConfig.randomization];
      stickers = INITIAL_STICKERS_MAP[defaultConfig.initialStickers];
    }
  });
</script>

<div class="max-h-[80vh] border border-black bg-white p-8 rounded-xl flex flex-col gap-6 w-32rem max-w-[90vw]">
  <h1 class="font-bold text-2xl text-center mb-2">
    {editing ? "Editing Algset" : "New Algset"}
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

  <div class="flex flex-col divide-y divide-black rounded-lg border border-black overflow-y-hidden">
    <h2 class="font-bold text-xl p-1">
      Subsets
    </h2>
    <div class="flex flex-col divide-y divide-black overflow-y-scroll">
      {#each subsets as [subset, algs], i}
        <div class="px-2 pt-2 pb-4">
          <CreateSubset
            name={subset}
            setName={(x) => {
              subsets[i][0] = x;
            }}
            {algs}
            setAlgs={(x) => {
              subsets[i][1] = x;
            }}
            canDelete={subsets.length > 1}
            deleteSubset={() => {
              const newSubsets = [...subsets];
              newSubsets.splice(i, 1);
              subsets = newSubsets;
            }}
          />
        </div>
      {/each}
    </div>
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

  <div class="flex gap-4 w-full whitespace-nowrap">
    <div class="w-full">
      <p class="text-sm font-bold">
        Cube Net Style
      </p>
      <Dropdown
        options={["Full", "Last Layer", "Roux"]}
        bind:chosen={netStyle}
      />
    </div>
    <div class="w-full">
      <p class="text-sm font-bold">
        Randomization
      </p>
      <Dropdown
        options={["AUF", "EPLL", "PLL"]}
        bind:chosen={randomization}
      />
    </div>
    <div class="w-full">
      <p class="text-sm font-bold">
        Sticker Style
      </p>
      <Dropdown
        options={["All", "Last Layer", "COLL", "OLL"]}
        bind:chosen={stickers}
      />
    </div>
  </div>

  <NiceButton
    handleClick={() => {
      // If we're editing, delete old algset and config
      if (editing) {
        delete $algsets[defaultName];
        delete $configs[defaultName];
      }
      // Add new algset
      const subsetsObj: {
        [key: string]: string[],
      } = {};
      subsets.forEach(([subset, algs]) => {
        subsetsObj[subset] = algs;
      });
      $algsets[name] = subsetsObj;
      // Also save config choices
      $configs[name] = {
        netStyle: reverseObject(NET_STYLE_MAP)[netStyle],
        randomization: reverseObject(RANDOMIZATION_MAP)[randomization],
        initialStickers: reverseObject(INITIAL_STICKERS_MAP)[stickers],
      };
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
