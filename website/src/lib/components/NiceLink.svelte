<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from '$app/state';

  let {
    href,
    children,
  }: {
    href: string,
    children: Snippet,
  } = $props();
</script>

{#if page.url.pathname === href}
  <a href={href} class="text-black underline">
    {@render children()}
  </a>
{:else}
  <a href={href} class="transition text-blue-500 hover:text-blue-400 underline">
    {@render children()}
  </a>
{/if}