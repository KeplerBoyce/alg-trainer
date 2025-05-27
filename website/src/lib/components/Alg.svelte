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
  }: {
    alg: string,
    netStyle: NetStyle,
    name?: string,
  } = $props();

  let stickers = $derived(getAlgStickers(alg));
</script>

<div class="flex flex-col gap-4 w-min">
  {#if netStyle === "FULL"}
    <FullNet stickers={stickers} />
  {:else if netStyle === "LL"}
    <LLNet stickers={stickers} />
  {:else}
    <RouxNet stickers={stickers} />
  {/if}

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
</div>
