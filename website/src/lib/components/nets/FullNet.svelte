<script lang="ts">
  import type { Stickers } from "$lib/types";
  import { squareStyle } from "$lib/helpers";

  const rowStyle = "flex gap-1";
  const colStyle = "flex flex-col gap-1";

  let {
    stickers,
  }: {
    stickers: Stickers
  } = $props();
</script>

<div class="grid grid-rows-4 grid-cols-[min-content_min-content_min-content] gap-2">
  <div></div>
  <!-- B face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.b.bottom.right)}></div>
      <div class={squareStyle(stickers.b.bottom.middle)}></div>
      <div class={squareStyle(stickers.b.bottom.left)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.b.middle.right)}></div>
      <div class={squareStyle(stickers.b.middle.middle)}></div>
      <div class={squareStyle(stickers.b.middle.left)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.b.top.right)}></div>
      <div class={squareStyle(stickers.b.top.middle)}></div>
      <div class={squareStyle(stickers.b.top.left)}></div>
    </div>
  </div>
  <div></div>

  <!-- L face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.l.bottom.left)}></div>
      <div class={squareStyle(stickers.l.middle.left)}></div>
      <div class={squareStyle(stickers.l.top.left)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.l.bottom.middle)}></div>
      <div class={squareStyle(stickers.l.middle.middle)}></div>
      <div class={squareStyle(stickers.l.top.middle)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.l.bottom.right)}></div>
      <div class={squareStyle(stickers.l.middle.right)}></div>
      <div class={squareStyle(stickers.l.top.right)}></div>
    </div>
  </div>

  <!-- U face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.u.top.left)}></div>
      <div class={squareStyle(stickers.u.top.middle)}></div>
      <div class={squareStyle(stickers.u.top.right)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.u.middle.left)}></div>
      <div class={squareStyle(stickers.u.middle.middle)}></div>
      <div class={squareStyle(stickers.u.middle.right)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.u.bottom.left)}></div>
      <div class={squareStyle(stickers.u.bottom.middle)}></div>
      <div class={squareStyle(stickers.u.bottom.right)}></div>
    </div>
  </div>

  <!-- R face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.r.top.right)}></div>
      <div class={squareStyle(stickers.r.middle.right)}></div>
      <div class={squareStyle(stickers.r.bottom.right)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.r.top.middle)}></div>
      <div class={squareStyle(stickers.r.middle.middle)}></div>
      <div class={squareStyle(stickers.r.bottom.middle)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.r.top.left)}></div>
      <div class={squareStyle(stickers.r.middle.left)}></div>
      <div class={squareStyle(stickers.r.bottom.left)}></div>
    </div>
  </div>

  <div></div>
  <!-- F face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.f.top.left)}></div>
      <div class={squareStyle(stickers.f.top.middle)}></div>
      <div class={squareStyle(stickers.f.top.right)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.f.middle.left)}></div>
      <div class={squareStyle(stickers.f.middle.middle)}></div>
      <div class={squareStyle(stickers.f.middle.right)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.f.bottom.left)}></div>
      <div class={squareStyle(stickers.f.bottom.middle)}></div>
      <div class={squareStyle(stickers.f.bottom.right)}></div>
    </div>
  </div>
  <div></div>

  <div></div>
  <!-- D face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.d.top.left)}></div>
      <div class={squareStyle(stickers.d.top.middle)}></div>
      <div class={squareStyle(stickers.d.top.right)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.d.middle.left)}></div>
      <div class={squareStyle(stickers.d.middle.middle)}></div>
      <div class={squareStyle(stickers.d.middle.right)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.d.bottom.left)}></div>
      <div class={squareStyle(stickers.d.bottom.middle)}></div>
      <div class={squareStyle(stickers.d.bottom.right)}></div>
    </div>
  </div>
  <div></div>
</div>