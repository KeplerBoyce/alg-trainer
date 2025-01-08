<script lang="ts">
	import '../app.css';
  import Header from '$lib/components/Header.svelte';
	let { children } = $props();
</script>

<div class="w-screen h-screen flex flex-col items-center">
  <Header />
  <div class="p-4 pt-12 pb-24 overflow-y-scroll">
    {@render children()}
  </div>
</div>
