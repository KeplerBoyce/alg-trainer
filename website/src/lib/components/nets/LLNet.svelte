<script lang="ts">
  import type { Stickers } from "$lib/types";
  import { emptyStyle, horizStyle, vertStyle, squareStyle } from "$lib/helpers";

  const rowStyle = "flex gap-1";
  const colStyle = "flex flex-col gap-1";

  let {
    stickers,
  }: {
    stickers: Stickers
  } = $props();
</script>

<div class={colStyle}>
  <div class={rowStyle}>
    <div class={emptyStyle()}></div>
    <div class={horizStyle(stickers.b.top.right)}></div>
    <div class={horizStyle(stickers.b.top.middle)}></div>
    <div class={horizStyle(stickers.b.top.left)}></div>
    <div class={emptyStyle()}></div>
  </div>
  <div class={rowStyle}>
    <div class={vertStyle(stickers.l.top.left)}></div>
    <div class={squareStyle(stickers.u.top.left)}></div>
    <div class={squareStyle(stickers.u.top.middle)}></div>
    <div class={squareStyle(stickers.u.top.right)}></div>
    <div class={vertStyle(stickers.r.top.right)}></div>
  </div>
  <div class={rowStyle}>
    <div class={vertStyle(stickers.l.top.middle)}></div>
    <div class={squareStyle(stickers.u.middle.left)}></div>
    <div class={squareStyle(stickers.u.middle.middle)}></div>
    <div class={squareStyle(stickers.u.middle.right)}></div>
    <div class={vertStyle(stickers.r.top.middle)}></div>
  </div>
  <div class={rowStyle}>
    <div class={vertStyle(stickers.l.top.right)}></div>
    <div class={squareStyle(stickers.u.bottom.left)}></div>
    <div class={squareStyle(stickers.u.bottom.middle)}></div>
    <div class={squareStyle(stickers.u.bottom.right)}></div>
    <div class={vertStyle(stickers.r.top.left)}></div>
  </div>
  <div class={rowStyle}>
    <div class={emptyStyle()}></div>
    <div class={horizStyle(stickers.f.top.left)}></div>
    <div class={horizStyle(stickers.f.top.middle)}></div>
    <div class={horizStyle(stickers.f.top.right)}></div>
    <div class={emptyStyle()}></div>
  </div>
</div>