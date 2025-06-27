<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    handleClick,
    color,
    hoverColor,
    activeColor,
    disabled,
    className,
  }: {
    children: Snippet,
    handleClick: () => void,
    color: string,
    hoverColor: string,
    activeColor: string,
    disabled?: boolean,
    className?: string,
  } = $props();
</script>

<button
  onclick={() => {
    if (!disabled) {
      handleClick();
    }
  }}
  class={`${className ?? ""} transition border border-black rounded-lg whitespace-nowrap ${disabled ? "hover:cursor-default text-gray-400 bg-gray-200 active:bg-gray-300" : `${color} ${hoverColor} ${activeColor}`}`}
>
  {@render children()}
</button>
