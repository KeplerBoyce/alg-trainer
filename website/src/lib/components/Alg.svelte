<script lang="ts">
  import { type NetStyle } from "$lib/types";
  import { getAlgStickers } from "$lib/helpers";
  import FullNet from "./nets/FullNet.svelte";
  import LLNet from "./nets/LLNet.svelte";
  import RouxNet from "./nets/RouxNet.svelte";

  let {
    alg,
    netStyle,
    name,
    hideSolution,
    small,
    topOnly,
  }: {
    alg: string,
    netStyle: NetStyle,
    name?: string,
    hideSolution?: boolean,
    small?: boolean,
    topOnly?: boolean,
  } = $props();

  let stickers = $derived(getAlgStickers(alg, topOnly ?? false));
</script>

<div class="flex flex-col items-center gap-4 min-w-min">
  {#if netStyle === "FULL"}
    <FullNet {stickers} {small} />
  {:else if netStyle === "LL"}
    <LLNet {stickers} {small} />
  {:else}
    <RouxNet {stickers} />
  {/if}

  {#if !hideSolution}
    <div class="flex gap-2">
      {#if name}
        <p class="font-bold">
          {name}
        </p>
      {/if}
      <p class="max-w-full text-left">
        {alg}
      </p>
    </div>
  {/if}
</div>
