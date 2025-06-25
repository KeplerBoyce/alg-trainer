<script lang="ts">
  import type { Stickers } from "$lib/types";
  import { squareStyle } from "$lib/helpers";

  const rowStyle = "flex gap-1";
  const colStyle = "flex flex-col gap-1";

  let {
    stickers,
    small,
  }: {
    stickers: Stickers,
    small?: boolean,
  } = $props();
</script>

<div class="grid grid-rows-4 grid-cols-[min-content_min-content_min-content] gap-2">
  <div></div>
  <!-- B face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.b.bottom.right, small)}></div>
      <div class={squareStyle(stickers.b.bottom.middle, small)}></div>
      <div class={squareStyle(stickers.b.bottom.left, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.b.middle.right, small)}></div>
      <div class={squareStyle(stickers.b.middle.middle, small)}></div>
      <div class={squareStyle(stickers.b.middle.left, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.b.top.right, small)}></div>
      <div class={squareStyle(stickers.b.top.middle, small)}></div>
      <div class={squareStyle(stickers.b.top.left, small)}></div>
    </div>
  </div>
  <div></div>

  <!-- L face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.l.bottom.left, small)}></div>
      <div class={squareStyle(stickers.l.middle.left, small)}></div>
      <div class={squareStyle(stickers.l.top.left, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.l.bottom.middle, small)}></div>
      <div class={squareStyle(stickers.l.middle.middle, small)}></div>
      <div class={squareStyle(stickers.l.top.middle, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.l.bottom.right, small)}></div>
      <div class={squareStyle(stickers.l.middle.right, small)}></div>
      <div class={squareStyle(stickers.l.top.right, small)}></div>
    </div>
  </div>

  <!-- U face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.u.top.left, small)}></div>
      <div class={squareStyle(stickers.u.top.middle, small)}></div>
      <div class={squareStyle(stickers.u.top.right, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.u.middle.left, small)}></div>
      <div class={squareStyle(stickers.u.middle.middle, small)}></div>
      <div class={squareStyle(stickers.u.middle.right, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.u.bottom.left, small)}></div>
      <div class={squareStyle(stickers.u.bottom.middle, small)}></div>
      <div class={squareStyle(stickers.u.bottom.right, small)}></div>
    </div>
  </div>

  <!-- R face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.r.top.right, small)}></div>
      <div class={squareStyle(stickers.r.middle.right, small)}></div>
      <div class={squareStyle(stickers.r.bottom.right, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.r.top.middle, small)}></div>
      <div class={squareStyle(stickers.r.middle.middle, small)}></div>
      <div class={squareStyle(stickers.r.bottom.middle, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.r.top.left, small)}></div>
      <div class={squareStyle(stickers.r.middle.left, small)}></div>
      <div class={squareStyle(stickers.r.bottom.left, small)}></div>
    </div>
  </div>

  <div></div>
  <!-- F face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.f.top.left, small)}></div>
      <div class={squareStyle(stickers.f.top.middle, small)}></div>
      <div class={squareStyle(stickers.f.top.right, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.f.middle.left, small)}></div>
      <div class={squareStyle(stickers.f.middle.middle, small)}></div>
      <div class={squareStyle(stickers.f.middle.right, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.f.bottom.left, small)}></div>
      <div class={squareStyle(stickers.f.bottom.middle, small)}></div>
      <div class={squareStyle(stickers.f.bottom.right, small)}></div>
    </div>
  </div>
  <div></div>

  <div></div>
  <!-- D face -->
  <div class={colStyle}>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.d.top.left, small)}></div>
      <div class={squareStyle(stickers.d.top.middle, small)}></div>
      <div class={squareStyle(stickers.d.top.right, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.d.middle.left, small)}></div>
      <div class={squareStyle(stickers.d.middle.middle, small)}></div>
      <div class={squareStyle(stickers.d.middle.right, small)}></div>
    </div>
    <div class={rowStyle}>
      <div class={squareStyle(stickers.d.bottom.left, small)}></div>
      <div class={squareStyle(stickers.d.bottom.middle, small)}></div>
      <div class={squareStyle(stickers.d.bottom.right, small)}></div>
    </div>
  </div>
  <div></div>
</div>