<script>
  import NiceLink from "./NiceLink.svelte";
</script>
<div class="fixed z-50 w-full flex gap-4 justify-center bg-white/50 backdrop-blur-lg items-center h-12 border-b border-black">
  <a href="/">
    <p class="text-3xl font-bold mr-6 hidden sm:block">
      speedcubetrainer
    </p>
  </a>
  <div class="flex gap-4">
    <NiceLink href="/">
      Trainer
    </NiceLink>
    <NiceLink href="/algsets">
      Algsets
    </NiceLink>
    <NiceLink href="/about">
      About/Help
    </NiceLink>
  </div>
</div>
