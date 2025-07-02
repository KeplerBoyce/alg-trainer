<script lang="ts">
	import '../app.css';
  import Header from '$lib/components/Header.svelte';
	let { children } = $props();
</script>

<Header />
<div class="w-screen h-screen p-1 pt-[3.25rem] sm:p-4 sm:pt-24 sm:pb-24 overflow-y-scroll">
  {@render children()}
</div>
