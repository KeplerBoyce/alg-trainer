<script lang="ts">
  import Alg from "./Alg.svelte";
  import { type InitialStickerType } from "$lib/types";
  import { STICKERS_OBJECT_MAP } from "$lib/constants";

  let {
    alg,
    name,
    initialStickers = "DEFAULT",
    callback,
  }: {
    alg: string,
    name: string,
    initialStickers: InitialStickerType,
    callback: () => void,
  } = $props();
</script>

<button on:click={callback}>
  <div class="transition-transform p-2 hover:bg-slate-100 active:bg-slate-200 w-min">
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
