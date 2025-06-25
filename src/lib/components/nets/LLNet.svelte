<script lang="ts">
  import type { Stickers } from "$lib/types";
  import { emptyStyle, horizStyle, vertStyle, squareStyle } from "$lib/helpers";

  const rowStyle = "flex gap-1";
  const colStyle = "flex flex-col gap-1";

  let {
    stickers,
    small,
  }: {
    stickers: Stickers
    small?: boolean,
  } = $props();
</script>

<div class={colStyle}>
  <div class={rowStyle}>
    <div class={emptyStyle(small)}></div>
    <div class={horizStyle(stickers.b.top.right, small)}></div>
    <div class={horizStyle(stickers.b.top.middle, small)}></div>
    <div class={horizStyle(stickers.b.top.left, small)}></div>
    <div class={emptyStyle(small)}></div>
  </div>
  <div class={rowStyle}>
    <div class={vertStyle(stickers.l.top.left, small)}></div>
    <div class={squareStyle(stickers.u.top.left, small)}></div>
    <div class={squareStyle(stickers.u.top.middle, small)}></div>
    <div class={squareStyle(stickers.u.top.right, small)}></div>
    <div class={vertStyle(stickers.r.top.right, small)}></div>
  </div>
  <div class={rowStyle}>
    <div class={vertStyle(stickers.l.top.middle, small)}></div>
    <div class={squareStyle(stickers.u.middle.left, small)}></div>
    <div class={squareStyle(stickers.u.middle.middle, small)}></div>
    <div class={squareStyle(stickers.u.middle.right, small)}></div>
    <div class={vertStyle(stickers.r.top.middle, small)}></div>
  </div>
  <div class={rowStyle}>
    <div class={vertStyle(stickers.l.top.right, small)}></div>
    <div class={squareStyle(stickers.u.bottom.left, small)}></div>
    <div class={squareStyle(stickers.u.bottom.middle, small)}></div>
    <div class={squareStyle(stickers.u.bottom.right, small)}></div>
    <div class={vertStyle(stickers.r.top.left, small)}></div>
  </div>
  <div class={rowStyle}>
    <div class={emptyStyle(small)}></div>
    <div class={horizStyle(stickers.f.top.left, small)}></div>
    <div class={horizStyle(stickers.f.top.middle, small)}></div>
    <div class={horizStyle(stickers.f.top.right, small)}></div>
    <div class={emptyStyle(small)}></div>
  </div>
</div>