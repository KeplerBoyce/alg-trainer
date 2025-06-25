<script lang="ts">
	import '../app.css';
  import Header from '$lib/components/Header.svelte';
	let { children } = $props();
</script>

<Header />
<div class="w-screen h-screen p-4 pt-24 pb-24 overflow-y-scroll">
  {@render children()}
</div>
