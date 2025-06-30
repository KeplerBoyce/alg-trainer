<script lang="ts">
  import Alg from "./Alg.svelte";
  import { type InitialStickerType } from "$lib/types";
  import { algKnowledgeBg } from "$lib/helpers";
  import { STICKERS_OBJECT_MAP } from "$lib/constants";

  let {
    alg,
    name,
    initialStickers = "DEFAULT",
    knowledgeLevel = 0,
    callback,
  }: {
    alg: string,
    name: string,
    initialStickers: InitialStickerType,
    knowledgeLevel: number,
    callback: () => void,
  } = $props();
</script>

<button on:click={callback}>
  <div class={`transition-transform p-2 w-min ${algKnowledgeBg(knowledgeLevel)}`}>
    <Alg
      {alg}
      netStyle="LL"
      {name}
      hideSolution
      small
      initialStickers={STICKERS_OBJECT_MAP[initialStickers]}
    />
  </div>
</button>
