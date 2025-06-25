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

<div class={`transition rounded-lg px-4 py-2 w-min whitespace-nowrap ${disabled ? "bg-gray-200 active:bg-gray-300" : `${color} hover:${hoverColor} active:${activeColor}`}`}>
  {#if disabled}
    <button class="hover:cursor-default">
      {@render children()}
    </button>
  {:else}
    <button onclick={handleClick}>
      {@render children()}
    </button>
  {/if}
</div>
