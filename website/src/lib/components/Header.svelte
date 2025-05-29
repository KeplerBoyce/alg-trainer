<script>
  import NiceLink from "./NiceLink.svelte";
</script>
<div class="fixed z-50 w-full flex gap-4 justify-center bg-white/50 backdrop-blur-lg items-center h-16 min-h-16 border-b-2 drop-shadow-md">
  <p class="text-3xl font-bold">
    Algorithm Trainer
  </p>
  <p>—</p>
  <div class="flex gap-4 items-center">
    <NiceLink href="/">
      Alg List
    </NiceLink>
    <NiceLink href="/trainer">
      Trainer
    </NiceLink>
  </div>
</div>
