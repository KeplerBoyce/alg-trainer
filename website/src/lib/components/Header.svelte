<script>
  import NiceLink from "./NiceLink.svelte";
</script>
<div class="fixed z-50 w-full flex gap-4 justify-center bg-white/50 backdrop-blur-lg items-center py-4 h-min border-b-2 drop-shadow-md">
  <p class="text-3xl font-bold mr-6">
    speedcubetrainer
  </p>
  <div class="flex gap-4 pt-1.5">
    <NiceLink href="/">
      Trainer
    </NiceLink>
    <NiceLink href="/alglist">
      Alg List
    </NiceLink>
    <NiceLink href="/about">
      About
    </NiceLink>
  </div>
</div>
