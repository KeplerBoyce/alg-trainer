<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    handleClick,
    color,
    hoverColor,
    activeColor,
    disabled,
  }: {
    children: Snippet,
    handleClick: () => void,
    color: string,
    hoverColor: string,
    activeColor: string,
    disabled?: boolean,
  } = $props();
</script>

<button
  onclick={() => {
    if (!disabled) {
      handleClick();
    }
  }}
  class={`transition rounded-lg px-4 py-2 w-min whitespace-nowrap ${disabled ? "hover:cursor-default bg-gray-200 active:bg-gray-300" : `${color} ${hoverColor} ${activeColor}`}`}
>
  {@render children()}
</button>
